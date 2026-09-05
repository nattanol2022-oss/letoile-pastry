(function () {
  const catButton = document.querySelector(".hero-cat");
  const catImage = catButton?.querySelector("img");
  const hero = catButton?.closest("section");

  if (!catButton || !catImage || !hero) return;

  const assetRoot = "./background_removed_images/";
  const frames = {
    idle: assetRoot + "Calico_cat_sitting_idle_202609051909_no_background.png",
    blink: assetRoot + "Calico_cat_mascot_blinking_202609051909_no_background.png",
    smile: assetRoot + "Calico_cat_mascot_smiling_202609051909_no_background.png",
    wave: assetRoot + "Calico_cat_waving_paw_mascot_202609051909_no_background.png",
    jump: [
      assetRoot + "Calico_cat_jumping_mid-air_202609051909_2_no_background.png",
      assetRoot + "Calico_cat_jumping_mid-air_202609051909_3_no_background.png",
      assetRoot + "Calico_cat_jumping_mid-air_202609051909_4_no_background.png",
    ],
  };

  const preload = (source) => {
    const image = new Image();
    image.src = source;
  };
  [frames.idle, frames.blink, frames.smile, frames.wave, ...frames.jump].forEach(preload);

  let idleTimer;
  let idleIndex = 0;
  let idleLoop;
  let isJumping = false;
  let isFollowing = false;
  let followFrame;
  const idleFrames = [frames.idle, frames.idle, frames.blink, frames.idle, frames.smile, frames.wave];

  function showFrame(source) {
    if (catImage.getAttribute("src") !== source) catImage.src = source;
  }

  function stopIdle() {
    window.clearInterval(idleLoop);
    window.clearTimeout(idleTimer);
  }

  function startIdle() {
    if (isJumping || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stopIdle();
    idleIndex = 0;
    idleLoop = window.setInterval(() => {
      showFrame(idleFrames[idleIndex % idleFrames.length]);
      idleIndex += 1;
    }, 900);
  }

  function scheduleIdle() {
    stopIdle();
    idleTimer = window.setTimeout(startIdle, 220);
  }

  function setScrollFrame(progress) {
    if (isJumping) return;
    stopIdle();
    const frameIndex = Math.min(frames.jump.length - 1, Math.floor(progress * frames.jump.length));
    showFrame(frames.jump[frameIndex]);
    scheduleIdle();
  }

  function rectanglesOverlap(first, second, padding = 24) {
    return !(
      first.right + padding < second.left ||
      first.left - padding > second.right ||
      first.bottom + padding < second.top ||
      first.top - padding > second.bottom
    );
  }

  function getVisibleObstacles() {
    return [...document.querySelectorAll(
      "header, footer a, main > section:not(:first-child) article, " +
      "main > section:not(:first-child) h1, main > section:not(:first-child) h2, " +
      "main > section:not(:first-child) h3, main > section:not(:first-child) p, " +
      "main > section:not(:first-child) a, main > section:not(:first-child) button, " +
      "main > section:not(:first-child) img"
    )]
      .filter((element) => {
        if (element === catButton || catButton.contains(element)) return false;
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
      })
      .map((element) => element.getBoundingClientRect());
  }

  function getVisibleTextObstacles() {
    const textRects = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const textNode = walker.currentNode;
      if (!textNode.textContent.trim() || catButton.contains(textNode)) continue;

      const parent = textNode.parentElement;
      if (!parent) continue;
      const style = window.getComputedStyle(parent);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;

      const range = document.createRange();
      range.selectNodeContents(textNode);
      [...range.getClientRects()].forEach((rect) => {
        if (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight &&
          rect.right > 0 &&
          rect.left < window.innerWidth
        ) {
          textRects.push(rect);
        }
      });
      range.detach();
    }

    return textRects;
  }

  function findFollowPosition() {
    const width = catButton.getBoundingClientRect().width;
    const height = width * 1.08;
    const margin = Math.max(12, window.innerWidth * 0.02);
    const center = (window.innerWidth - width) / 2;
    const candidates = [
      { left: margin, top: window.innerHeight - height - margin },
      { left: center, top: window.innerHeight - height - margin },
      { left: window.innerWidth - width - margin, top: window.innerHeight - height - margin },
      { left: margin, top: window.innerHeight * 0.12 },
      { left: center, top: window.innerHeight * 0.12 },
      { left: window.innerWidth - width - margin, top: window.innerHeight * 0.12 },
    ];
    const obstacles = [...getVisibleObstacles(), ...getVisibleTextObstacles()];
    const preferredIndex = Math.floor(window.scrollY / Math.max(320, window.innerHeight * 0.85)) % 3;
    const preferredLeft = [margin, center, window.innerWidth - width - margin][preferredIndex];
    const orderedCandidates = candidates
      .map((candidate, index) => ({
        candidate,
        index,
        distance: Math.abs(candidate.left - preferredLeft),
      }))
      .sort((first, second) => first.distance - second.distance);
    const free = orderedCandidates.find(({ candidate }) => {
      const rect = { ...candidate, right: candidate.left + width, bottom: candidate.top + height };
      return !obstacles.some((obstacle) => rectanglesOverlap(rect, obstacle));
    })?.candidate;

    if (free) return { position: free, peeking: false };

    const peekLeft = preferredIndex === 0
      ? -width * 0.72
      : window.innerWidth - width * 0.28;
    return {
      position: {
        left: peekLeft,
        top: Math.max(24, window.innerHeight - height - margin),
      },
      peeking: true,
    };
  }

  function updateFollower() {
    followFrame = undefined;
    const threshold = Math.max(160, hero.getBoundingClientRect().height * 0.55);
    const shouldFollow = window.scrollY > threshold;

    if (!shouldFollow) {
      isFollowing = false;
      catButton.classList.remove("is-following", "is-peeking");
      catButton.style.removeProperty("left");
      catButton.style.removeProperty("top");
      catButton.style.removeProperty("right");
      if (!isJumping) showFrame(frames.idle);
      return;
    }

    if (!isFollowing) {
      const heroRect = catButton.getBoundingClientRect();
      isFollowing = true;
      catButton.classList.add("is-following");
      catButton.style.left = `${heroRect.left}px`;
      catButton.style.top = `${heroRect.top}px`;
      catButton.style.right = "auto";
      // Start from the current viewport position, then glide to the first safe zone.
      window.requestAnimationFrame(() => {
        if (isFollowing) updateFollower();
      });
      playJump();
      return;
    }

    const { position, peeking } = findFollowPosition();
    catButton.style.left = `${position.left}px`;
    catButton.style.top = `${position.top}px`;
    catButton.style.right = "auto";
    catButton.classList.toggle("is-peeking", peeking);
  }

  function requestFollowerUpdate() {
    if (followFrame === undefined) followFrame = window.requestAnimationFrame(updateFollower);
  }

  function setupScrollAnimation() {
    if (!window.gsap || !window.ScrollTrigger) {
      window.addEventListener("scroll", scheduleIdle, { passive: true });
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.to({}, {
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (trigger) => setScrollFrame(trigger.progress),
        onLeave: scheduleIdle,
        onLeaveBack: scheduleIdle,
      },
    });
  }

  function playJump() {
    if (isJumping) return;
    isJumping = true;
    stopIdle();
    catButton.classList.add("is-jumping");

    frames.jump.forEach((frame, index) => {
      window.setTimeout(() => showFrame(frame), index * 130);
    });
    window.setTimeout(() => {
      catButton.classList.remove("is-jumping");
      showFrame(frames.idle);
      isJumping = false;
      scheduleIdle();
    }, 760);
  }

  catButton.addEventListener("click", () => {
    playJump();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  setupScrollAnimation();
  window.addEventListener("scroll", requestFollowerUpdate, { passive: true });
  window.addEventListener("resize", requestFollowerUpdate);
  scheduleIdle();
})();
