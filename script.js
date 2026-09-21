gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();

    tl.from(".navbar", { 
        y: -40, 
        opacity: 0, 
        duration: 0.8 
    })
    .from(".hero-text-side h1", { 
        y: 30, 
        opacity: 0, 
        duration: 0.7 
    })
    .from(".hero-text-side h2", { 
        y: 25, 
        opacity: 0, 
        duration: 0.6 
    })
    .from(".hero-text-side p, .hero-btns, .social-icons", { 
        y: 20, 
        opacity: 0, 
        duration: 0.6 
    })

    .fromTo(".hero-image-side", 
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


    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });

    gsap.from(".section-title", {
        scrollTrigger: {
            trigger: ".section-title",
            start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8
    });
