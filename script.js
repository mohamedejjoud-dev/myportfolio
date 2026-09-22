
const tl = gsap.timeline();

// Navbar - FROM
tl.from(".navbar", {
    y: -40,
    opacity: 0,
    duration: 0.8
})

// Hero heading - FROM
.from(".hero-text-side h1", {
    y: 30,
    opacity: 0,
    duration: 0.7
})

// Hero subtitle - FROM
.from(".hero-text-side h2", {
    y: 25,
    opacity: 0,
    duration: 0.6
})

// Paragraph + buttons - FROM
.from(".hero-text-side p, .hero-btns, .social-icons", {
    y: 20,
    opacity: 0,
    duration: 0.6
})

// Hero image - FROM TO
.fromTo(
    ".hero-image-side",
    {
        scale: 0.7,
        opacity: 0,
        y: 30
    },
    {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    },
    "-=0.4"
);