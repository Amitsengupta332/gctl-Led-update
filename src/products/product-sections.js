import { productSections } from "./product-sections-data.js";

function productBadge(product) {
  if (!product.badge) return "";

  return `
    <span
      class="absolute left-4 top-4 z-10 rounded px-2 py-1 text-[10px] font-medium uppercase text-white ${product.badgeClass || ""}"
    >
      ${product.badge}
    </span>
  `;
}

function productImage(product) {
  if (!product.image) {
    return `
      <div class="flex h-full w-full items-center justify-center bg-[#f7fbff]">
        <div class="text-center">
          <span
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white text-[20px] text-[#0057d8]"
          >
            🖼
          </span>

          <p class="mt-2 text-[11px] font-medium text-slate-400">
            Image Coming Soon
          </p>
        </div>
      </div>
    `;
  }

  return `
    <img
      src="${product.image}"
      alt="${product.name}"
      loading="lazy"
      decoding="async"
      class="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
    />
  `;
}

function productSlug(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function sliderArrowIcon(direction = "next") {
  const path =
    direction === "previous"
      ? '<path d="m15.5 4.5-7.5 7.5 7.5 7.5"></path>'
      : '<path d="m8.5 4.5 7.5 7.5-7.5 7.5"></path>';

  return `
    <svg
      class="h-10 w-10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="square"
      stroke-linejoin="miter"
      aria-hidden="true"
    >
      ${path}
    </svg>
  `;
}

function productCard(product) {
  const productLink = product.link || "#";

  return `
    <a
      href="${productLink}"
      data-product-card
      class="group block w-[86%] shrink-0 snap-start overflow-hidden rounded-[12px] border border-[#dbe8f5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,87,216,0.14)] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
    >
      <div class="relative h-[185px] overflow-hidden bg-white">
        ${productBadge(product)}
        ${productImage(product)}
      </div>

      <div class="p-4">
        <h3 class="text-[16px] font-medium text-[#0b1f33]">
          ${product.name}
        </h3>

        <p class="mt-2 text-[13px] leading-6 text-[#5d6b7a]">
          ${product.desc}
        </p>

        <span
          class="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#0057d8] transition-all duration-300 group-hover:gap-2"
        >
          Learn More
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  `;
}

function productSection(section, sectionIndex) {
  const sliderId = `product-slider-${sectionIndex}`;

  return `
    <section
      data-product-section
      class="${section.bg} overflow-hidden py-10"
    >
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">

        <!-- Section heading -->
        <div
          class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <h2 class="text-[26px] font-medium text-[#0b1f33]">
            ${section.title}
          </h2>

          <a
            href="${section.link}"
            class="text-[13px] font-medium text-[#0057d8] transition hover:text-[#0b1f33]"
          >
            View All Products →
          </a>
        </div>

        <!-- Product slider -->
        <div class="relative">

          <div
            id="${sliderId}"
            data-product-slider
            tabindex="0"
            aria-label="${section.title} product slider"
            class="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-5 pt-1 outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            ${section.products.map(productCard).join("")}
          </div>

          <!-- Slider navigation -->
          <div
            data-product-slider-controls
            class="pointer-events-none absolute inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-between"
          >
            <!-- Previous Button -->
            <button
              type="button"
              data-product-prev="${sliderId}"
              aria-label="Previous ${section.title} products"
              class="pointer-events-auto flex h-16 w-12 cursor-pointer select-none items-center justify-start bg-transparent text-[#50555c] transition-colors duration-200 hover:text-[#0057d8] disabled:cursor-default disabled:text-[#d8dce0]"
            >
              ${sliderArrowIcon("previous")}
            </button>

            <!-- Next Button -->
            <button
              type="button"
              data-product-next="${sliderId}"
              aria-label="Next ${section.title} products"
              class="pointer-events-auto flex h-16 w-12 cursor-pointer select-none items-center justify-end bg-transparent text-[#50555c] transition-colors duration-200 hover:text-[#0057d8] disabled:cursor-default disabled:text-[#d8dce0]"
            >
              ${sliderArrowIcon("next")}
            </button>
          </div>

        </div>
      </div>
    </section>
  `;
}
function initSingleProductSlider(slider) {
  const section = slider.closest("[data-product-section]");

  if (!section) return;

  const sliderId = slider.id;

  const previousButton = section.querySelector(
    `[data-product-prev="${sliderId}"]`,
  );

  const nextButton = section.querySelector(`[data-product-next="${sliderId}"]`);

  const controls = section.querySelector("[data-product-slider-controls]");

  function getScrollAmount() {
    const firstCard = slider.querySelector("[data-product-card]");

    if (!firstCard) {
      return slider.clientWidth;
    }

    const sliderStyle = window.getComputedStyle(slider);

    const parsedGap = Number.parseFloat(
      sliderStyle.columnGap || sliderStyle.gap,
    );

    const gap = Number.isNaN(parsedGap) ? 20 : parsedGap;

    return firstCard.getBoundingClientRect().width + gap;
  }

  function updateSliderControls() {
    const maximumScrollLeft = slider.scrollWidth - slider.clientWidth;

    const hasOverflow = maximumScrollLeft > 4;

    const isAtStart = slider.scrollLeft <= 4;

    const isAtEnd = slider.scrollLeft >= maximumScrollLeft - 4;

    if (controls) {
      controls.classList.toggle("hidden", !hasOverflow);
      controls.classList.toggle("flex", hasOverflow);
    }

    if (previousButton) {
      previousButton.disabled = !hasOverflow || isAtStart;
    }

    if (nextButton) {
      nextButton.disabled = !hasOverflow || isAtEnd;
    }
  }

  function slidePrevious() {
    slider.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  }

  function slideNext() {
    slider.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  }

  previousButton?.addEventListener("click", slidePrevious);

  nextButton?.addEventListener("click", slideNext);

  slider.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(updateSliderControls);
    },
    {
      passive: true,
    },
  );

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      slidePrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      slideNext();
    }
  });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(() => {
      updateSliderControls();
    });

    resizeObserver.observe(slider);
  } else {
    window.addEventListener("resize", updateSliderControls);
  }

  updateSliderControls();

  window.requestAnimationFrame(() => {
    updateSliderControls();
  });
}

function initProductSliders(root) {
  const sliders = root.querySelectorAll("[data-product-slider]");

  sliders.forEach((slider) => {
    initSingleProductSlider(slider);
  });
}

export function initProductSections() {
  const root = document.querySelector("#product-sections-root");

  if (!root) return;

  if (root.dataset.productSectionsReady === "true") {
    return;
  }

  root.dataset.productSectionsReady = "true";

  root.innerHTML = productSections
    .map((section, index) => {
      return productSection(section, index);
    })
    .join("");

  initProductSliders(root);
}
