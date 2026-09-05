(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector("main > section:first-child");
  if (!hero) return;

  const motion = gsap.matchMedia();
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from("header", { y: -24, autoAlpha: 0, duration: 0.7 })
      .from(hero.querySelector("p"), { y: 22, autoAlpha: 0, duration: 0.55 }, "-=0.35")
      .from(hero.querySelector("h1"), { y: 34, autoAlpha: 0, duration: 0.8 }, "-=0.4")
      .from(hero.querySelectorAll("a"), { y: 18, autoAlpha: 0, stagger: 0.1, duration: 0.5 }, "-=0.45");

    const heroVideo = hero.querySelector("video");
    if (heroVideo) {
      gsap.to(heroVideo, {
        yPercent: 10,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    gsap.utils.toArray("main > section:not(:first-child) > div, main > section:not(:first-child) > article").forEach((section) => {
      gsap.from(section, {
        y: 42,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          once: true,
        },
      });
    });

    gsap.from(".dessert-card", {
      y: 56,
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#menu",
        start: "top 78%",
        once: true,
      },
    });

    gsap.utils.toArray("#custom img, #story img").forEach((image) => {
      gsap.to(image, {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    gsap.utils.toArray(".order-link, footer a, header nav a").forEach((link) => {
      link.addEventListener("mouseenter", () => gsap.to(link, { y: -3, duration: 0.2, overwrite: true }));
      link.addEventListener("mouseleave", () => gsap.to(link, { y: 0, duration: 0.25, overwrite: true }));
    });

    return () => {
      intro.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  });

  if (reduceMotion) {
    ScrollTrigger.refresh();
  }
})();
