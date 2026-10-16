(function () {
  const catButton = document.querySelector(".hero-cat");
  const catModel = catButton?.querySelector("model-viewer");
  const hero = catButton?.closest("section");
  if (!catButton || !catModel || !hero) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isFollowing = false;
  let followFrame;
  let launchTimeout;
  let pointerTilt = { x: 0, y: 0 };
  let walking = false;

  function setOrbit(orbit) {
    if (!reducedMotion.matches) catModel.cameraOrbit = orbit;
  }

  function setMovement(isWalking) {
    if (walking === isWalking) return;
    walking = isWalking;
    catModel.animationName = isWalking ? "cat walk" : "cat lazy idle";
    if (!reducedMotion.matches) catModel.play();
  }

  function animateOrbit() {
    if (reducedMotion.matches || document.hidden) return;
    const now = performance.now() / 1000;
    const drift = Math.sin(now * 0.7) * 5;
    const lift = 76 + Math.sin(now * 0.9) * 2;
    setOrbit(`${drift + pointerTilt.x * 4}deg ${lift + pointerTilt.y * 3}deg 105%`);
    requestAnimationFrame(animateOrbit);
  }

  function playLaunch() {
    if (reducedMotion.matches) return;
    window.clearTimeout(launchTimeout);
    catButton.classList.remove("is-launching");
    void catButton.offsetWidth;
    catButton.classList.add("is-launching");
    launchTimeout = window.setTimeout(() => catButton.classList.remove("is-launching"), 1000);
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
        return style.display !== "none" && style.visibility !== "hidden" &&
          Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
      })
      .map((element) => element.getBoundingClientRect());
  }

  function findFollowPosition() {
    const rect = catButton.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const margin = Math.max(12, window.innerWidth * 0.02);
    const center = (window.innerWidth - width) / 2;
    const candidates = [
      { left: margin, top: window.innerHeight - height - margin },
      { left: center, top: window.innerHeight - height - margin },
      { left: window.innerWidth - width - margin, top: window.innerHeight - height - margin },
      { left: margin, top: window.innerHeight * 0.12 },
      { left: window.innerWidth - width - margin, top: window.innerHeight * 0.12 },
    ];
    const preferred = [margin, center, window.innerWidth - width - margin][
      Math.floor(window.scrollY / Math.max(320, window.innerHeight * .85)) % 3
    ];
    const obstacles = getVisibleObstacles();
    return candidates
      .sort((a, b) => Math.abs(a.left - preferred) - Math.abs(b.left - preferred))
      .find((candidate) => !obstacles.some((obstacle) => rectanglesOverlap({
        ...candidate, right: candidate.left + width, bottom: candidate.top + height
      }, obstacle))) || candidates[0];
  }

  function updateFollower() {
    followFrame = undefined;
    const shouldFollow = window.scrollY > Math.max(160, hero.getBoundingClientRect().height * .55);
    if (!shouldFollow) {
      isFollowing = false;
      setMovement(false);
      catButton.classList.remove("is-following");
      catButton.style.removeProperty("left");
      catButton.style.removeProperty("top");
      catButton.style.removeProperty("right");
      setOrbit("0deg 76deg 105%");
      return;
    }
    if (!isFollowing) {
      isFollowing = true;
      catButton.classList.add("is-following");
      playLaunch();
    }
    setMovement(true);
    const position = findFollowPosition();
    catButton.style.left = `${position.left}px`;
    catButton.style.top = `${position.top}px`;
    catButton.style.right = "auto";
  }

  function requestFollowerUpdate() {
    if (followFrame === undefined) followFrame = requestAnimationFrame(updateFollower);
  }

  catButton.addEventListener("pointermove", (event) => {
    const rect = catButton.getBoundingClientRect();
    pointerTilt = {
      x: (event.clientX - rect.left) / rect.width - .5,
      y: (event.clientY - rect.top) / rect.height - .5
    };
  });
  catButton.addEventListener("pointerleave", () => { pointerTilt = { x: 0, y: 0 }; });
  catButton.addEventListener("click", () => {
    playLaunch();
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  });
  window.addEventListener("scroll", requestFollowerUpdate, { passive: true });
  window.addEventListener("resize", requestFollowerUpdate);
  animateOrbit();
})();
