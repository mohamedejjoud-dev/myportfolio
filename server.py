#!/usr/bin/env python3
"""Static portfolio server + contact-form endpoint that sends mail over Gmail SMTP.

Configuration file: smtp_config.env (next to this script, never commit it)
    GMAIL_USER=you@gmail.com
    GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
    TO_EMAIL=you@gmail.com        # optional, defaults to GMAIL_USER

Get an app password at: Google Account -> Security -> 2-Step Verification -> App passwords
"""

import json
import os
import smtplib
import ssl
import sys
from email.message import EmailMessage
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qsl

ROOT = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(ROOT, "smtp_config.env")
def _port():
    # Some launch environments inject PORT=0 (meaning "any port") - force our real port.
    try:
        value = int(os.environ.get("PORT", "8080"))
    except ValueError:
        value = 8080
    return value if value > 0 else 8080


PORT = _port()
MAX_BODY = 64 * 1024


def load_config():
    cfg = {}
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                cfg[key.strip()] = value.strip().strip('"').strip("'")
    return cfg


def clean(value, limit=2000):
    return str(value or "").strip()[:limit]


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # --- contact form ---------------------------------------------------
    def do_POST(self):
        if self.path.split("?")[0] != "/api/contact":
            self.send_error(404, "Not found")
            return

        origin = self.headers.get("Origin") or ""
        host = self.headers.get("Host") or ""
        if origin and origin.rsplit("//", 1)[-1] != host:
            self._respond({"success": False, "message": "Cross-origin not allowed."}, 403)
            return

        try:
            length = min(int(self.headers.get("Content-Length") or 0), MAX_BODY)
        except ValueError:
            length = 0
        raw = self.rfile.read(length)

        ctype = (self.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        try:
            if ctype == "application/json":
                data = json.loads(raw.decode("utf-8") or "{}")
                if not isinstance(data, dict):
                    raise ValueError("expected object")
            else:
                data = dict(parse_qsl(raw.decode("utf-8", "replace"), keep_blank_values=True))
        except (ValueError, json.JSONDecodeError):
            self._respond({"success": False, "message": "Invalid request body."}, 400)
            return

        # Honeypot: pretend success so bots don't learn anything.
        if clean(data.get("_honey")) or clean(data.get("botcheck")):
            self._respond({"success": True, "message": "Thanks! Your message has been sent."})
            return

        name = clean(data.get("name"), 200)
        email = clean(data.get("email"), 320)
        phone = clean(data.get("phone"), 50)
        subject = clean(data.get("subject"), 300)
        message = clean(data.get("message"))

        if not message or not name:
            self._respond({"success": False, "message": "Name and message are required."}, 400)
            return

        cfg = load_config()
        gmail_user = cfg.get("GMAIL_USER", "")
        app_password = cfg.get("GMAIL_APP_PASSWORD", "")
        to_email = cfg.get("TO_EMAIL") or gmail_user
        if not gmail_user or not app_password:
            self.log_error("smtp_config.env missing GMAIL_USER / GMAIL_APP_PASSWORD")
            self._respond({
                "success": False,
                "message": "Server email is not configured yet (smtp_config.env).",
            }, 503)
            return

        mail = EmailMessage()
        mail["From"] = gmail_user
        mail["To"] = to_email
        mail["Reply-To"] = email if "@" in email else gmail_user
        mail["Subject"] = subject or f"Portfolio message from {name}"
        body = [
            f"Name: {name}",
            f"Email: {email}",
            f"Phone: {phone}",
            "",
            "Message:",
            message,
            "",
            "-- sent from your portfolio contact form",
        ]
        mail.set_content("\n".join(body))

        try:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=30) as smtp:
                smtp.login(gmail_user, app_password)
                smtp.send_message(mail)
        except smtplib.SMTPAuthenticationError:
            self.log_error("Gmail rejected the credentials (check the app password).")
            self._respond({"success": False, "message": "Email login failed on the server."}, 502)
            return
        except Exception as exc:  # noqa: BLE001 - report any send failure to the client
            self.log_error(f"SMTP send failed: {exc}")
            self._respond({"success": False, "message": "Could not send the email."}, 502)
            return

        self.log_message("Contact form email sent to %s (from %s)", to_email, name)
        self._respond({"success": True, "message": "Thanks! Your message has been sent."})

    def _respond(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        accept = self.headers.get("Accept") or ""
        if "text/html" in accept and not payload.get("success"):
            body = (
                "<!doctype html><meta charset='utf-8'><title>Message</title>"
                "<p style='font-family:sans-serif'>Your message could not be sent - "
                "please email mohamedjoud257@gmail.com directly.</p>"
                '<p style="font-family:sans-serif"><a href="/#contact">Back to the form</a></p>'
            ).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))
        sys.stderr.flush()


def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), PortfolioHandler)
    configured = "configured" if os.path.exists(CONFIG_PATH) else "NOT configured (smtp_config.env missing)"
    print(f"Portfolio serving http://127.0.0.1:{PORT}/  |  SMTP: {configured}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()


if __name__ == "__main__":
    main()
