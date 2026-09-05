(function () {
  const showcase = document.querySelector(".showcase");
  if (!showcase) return;

  const asset = (name) => `./renamed-images/${name}_no_background.png`;
  const products = [
    ["Brownie", "Brownie Cookie Box", "$18.00", "LAPOIRE_Brownie_Cookie_Box_Set", "Chocolate brownie cookie box with toasted almond.", ["#2D1810", "#5C3A21", "#D4A359"]],
    ["Brownie", "Brownie Cookie Pack", "$18.40", "LAPOIRE_Brownie_Cookie_Packaging_Set", "Gift-ready brownie cookies in illustrated packaging.", ["#2D1810", "#5C3A21", "#D4A359"]],
    ["Brownie", "Brownie Cookie Single", "$8.00", "LAPOIRE_Brownie_Cookie_Single_Pack", "A rich brownie cookie for one sweet moment.", ["#2D1810", "#5C3A21", "#D4A359"]],
    ["Brownie", "Chewy Brownie Box", "$19.40", "LAPOIRE_Chewy_Brownies_Box_Set", "Soft, fudgy brownies packed for sharing.", ["#2D1810", "#5C3A21", "#D4A359"]],
    ["Brownie", "Chewy Brownie Single", "$8.50", "LAPOIRE_Chewy_Brownies_Single_Piece", "A dense, chewy chocolate brownie.", ["#2D1810", "#5C3A21", "#D4A359"]],
    ["Brownie", "Almond Brownie Pan", "$19.00", "LAPOIRE_Brownie_Almond_Foil_Pan", "Brownie pan finished with toasted almond slices.", ["#2D1810", "#5C3A21", "#D4A359"]],
    ["Brookie", "Brookie Melt", "$19.40", "LAPOIRE_Brookie_Marshmallow_Box_Set", "Chewy brownie-cookie base with toasted marshmallow.", ["#1A1A1A", "#6B4541", "#FDF0ED"]],
    ["Brookie", "Brookie Marshmallow", "$12.00", "LAPOIRE_Brookie_Marshmallow", "A soft brookie topped with golden marshmallow.", ["#1A1A1A", "#6B4541", "#FDF0ED"]],
    ["Brookie", "Brookie Oreo", "$12.00", "LAPOIRE_Brookie_Oreo", "Cookie brownie with crunchy Oreo pieces.", ["#1A1A1A", "#6B4541", "#FDF0ED"]],
    ["Brookie", "Brookie Mix Twin", "$19.40", "LAPOIRE_Brookie_Mix_Twin", "Two brookie styles in one shareable set.", ["#1A1A1A", "#6B4541", "#FDF0ED"]],
    ["Brookie", "Brookie Oreo Box", "$19.40", "LAPOIRE_Brookie_Oreo_Box_Set", "Oreo brookies in a generous gift box.", ["#1A1A1A", "#6B4541", "#FDF0ED"]],
    ["Brookie", "Brookie Set Box", "$19.40", "LAPOIRE_Brookie_SetBox", "A mixed brookie set for gifting.", ["#1A1A1A", "#6B4541", "#FDF0ED"]],
    ["Cold Crepe", "Strawberry Cold Crepe", "$18.80", "LAPOIRE_Strawberry_Cold_Crepe", "Cold crepe with bright strawberry cream.", ["#7E2638", "#B83D58", "#E85D75"]],
    ["Cold Crepe", "Blueberry Cold Crepe", "$18.80", "LAPOIRE_Blueberry_Cold_Crepe", "Cold crepe with a mellow blueberry center.", ["#30264B", "#4A3B6B", "#8E78C2"]],
    ["Cold Crepe", "Oreo Cold Crepe", "$18.80", "LAPOIRE_Oreo_Cold_Crepe", "Creamy cold crepe finished with Oreo.", ["#30264B", "#4A3B6B", "#D9D0C7"]],
    ["Cold Crepe", "Cold Crepe 4-Piece", "$19.40", "LAPOIRE_Cold_Crepe_4-Piece_Set", "A four-piece cold crepe tasting set.", ["#FFF8EE", "#D6A86B", "#E85D75"]],
    ["Cake", "Butter Sugar Cake", "$18.60", "LAPOIRE_Butter_Sugar_Cake", "Soft butter cake with a golden sugar crust.", ["#8A5B16", "#B98224", "#F4C430"]],
    ["Cake", "Banana Chocolate Chip Cake", "$18.60", "LAPOIRE_Banana_Cake_Chocolate_Chip", "Moist banana cake with chocolate chips.", ["#7B421C", "#A9652A", "#D99A4A"]],
    ["Cake", "Chocolate Muffins", "$18.60", "LAPOIRE_Chocolate_Muffins", "Dark chocolate muffins with a rich crumb.", ["#1A1A1A", "#3D2A27", "#B77A65"]],
    ["Chocolate", "Dubai Chocolate", "$19.40", "LAPOIRE_Dubai_Chocolate", "Chocolate with a rich pistachio-style filling.", ["#24140E", "#5C3A21", "#D4A359"]],
    ["Cookies & Toast", "Butter Cookies with Porkfloss", "$18.00", "LAPOIRE_Butter_Cookies_with_Porkflosss", "Golden butter cookies with savory pork floss.", ["#8B5A32", "#B98255", "#E0B084"]],
    ["Cookies & Toast", "Crispy Toasts 3-Pack", "$12.00", "LAPOIRE_Crispy_Toasts_3-Pack_Set", "Three festive packs of crisp buttery toasts.", ["#8B5A32", "#B98255", "#D4A359"]],
    ["Cookies & Toast", "Crispy Toast Single", "$5.00", "LAPOIRE_Crispy_Toasts_Single_Pack", "A crisp toast pack for a quick bite.", ["#8B5A32", "#B98255", "#D4A359"]],
    ["Cookies & Toast", "Crispy Toasts Loose", "$8.00", "LAPOIRE_Crispy_Toasts_UnpackagedLoose", "A sharing pile of golden crispy toasts.", ["#8B5A32", "#B98255", "#D4A359"]],
  ].map(([category, name, price, file, description, palette]) => ({
    category, name, price, description, palette, image: asset(file), alt: name,
  }));
  const image = showcase.querySelector("[data-showcase-image]");
  const title = showcase.querySelector("[data-showcase-title]") || showcase.querySelector("#showcase-title");
  const description = showcase.querySelector("[data-showcase-description]");
  const price = showcase.querySelector("[data-showcase-price]");
  const list = showcase.querySelector("[data-showcase-list]");
  const categoryTabs = showcase.querySelector("[data-showcase-categories]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const categories = [...new Set(products.map((product) => product.category))];
  let activeIndex = 0;
  let activeCategory = categories[0];

  function renderMenu(category) {
    activeCategory = category;
    categoryTabs.querySelectorAll("[data-showcase-category]").forEach((tab) => {
      const isActive = tab.dataset.showcaseCategory === activeCategory;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    list.innerHTML = products.map((product, index) => product.category !== activeCategory ? "" : `
      <button class="showcase-card ${index === activeIndex ? "is-active" : ""} flex w-full items-center gap-4 rounded-2xl border p-3 text-left" type="button" data-showcase-item data-index="${index}">
        <img class="h-20 w-20 rounded-xl object-cover" src="${product.image}" alt="">
        <span><strong class="block font-display text-2xl">${product.name}</strong><small class="text-white/60">${product.price} · ${product.category}</small></span>
      </button>
    `).join("");
    list.querySelectorAll("[data-showcase-item]").forEach((item) => {
      item.addEventListener("click", () => render(Number(item.dataset.index)));
    });
    const activeCard = list.querySelector(".is-active");
    if (activeCard) activeCard.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
  }

  function render(index) {
    activeIndex = (index + products.length) % products.length;
    const product = products[activeIndex];
    if (product.category !== activeCategory) renderMenu(product.category);
    const [main, secondary, accent] = product.palette;
    showcase.style.setProperty("--showcase-main", main);
    showcase.style.setProperty("--showcase-secondary", secondary);
    showcase.style.setProperty("--showcase-accent", accent);
    title.textContent = product.name;
    description.textContent = product.description;
    price.textContent = product.price;
    image.alt = product.alt;
    showcase.querySelectorAll("[data-showcase-item]").forEach((item) => {
      item.classList.toggle("is-active", Number(item.dataset.index) === activeIndex);
    });

    if (reduceMotion || !window.gsap) {
      image.src = product.image;
      return;
    }
    window.gsap.timeline()
      .to([image, title, description, price], { autoAlpha: 0, y: 14, duration: 0.18, stagger: 0.02 })
      .add(() => { image.src = product.image; })
      .to([image, title, description, price], { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.04, ease: "power3.out" });
  }

  categoryTabs.innerHTML = categories.map((category) => `
    <button class="showcase-category-tab shrink-0 rounded-full px-3 py-2 text-[.65rem] font-semibold uppercase tracking-[.12em]" type="button" role="tab" data-showcase-category="${category}" aria-selected="${category === activeCategory}">${category}</button>
  `).join("");
  categoryTabs.querySelectorAll("[data-showcase-category]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const firstIndex = products.findIndex((product) => product.category === tab.dataset.showcaseCategory);
      render(firstIndex);
    });
  });
  showcase.querySelector("[data-showcase-prev]").addEventListener("click", () => render(activeIndex - 1));
  showcase.querySelector("[data-showcase-next]").addEventListener("click", () => render(activeIndex + 1));
  showcase.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") render(activeIndex - 1);
    if (event.key === "ArrowDown") render(activeIndex + 1);
  });
  showcase.tabIndex = 0;
  let autoplay = reduceMotion ? null : window.setInterval(() => render(activeIndex + 1), 3000);
  const pauseAutoplay = () => window.clearInterval(autoplay);
  const resumeAutoplay = () => {
    if (reduceMotion) return;
    window.clearInterval(autoplay);
    autoplay = window.setInterval(() => render(activeIndex + 1), 3000);
  };
  showcase.addEventListener("mouseenter", pauseAutoplay);
  showcase.addEventListener("mouseleave", resumeAutoplay);
  showcase.addEventListener("focusin", pauseAutoplay);
  showcase.addEventListener("focusout", resumeAutoplay);
  renderMenu(activeCategory);
  render(0);
})();
