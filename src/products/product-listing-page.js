import { navItems } from "../data/nav-data.js";
// const PRODUCT_LISTING_HERO = {
// desktopImage: "/images/products/banners/product-listing-hero-desktop.avif",

// mobileImage: "/images/products/banners/product-listing-hero-mobile.avif",

// youtubeVideoId: "dQw4w9WgXcQ",
// };

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DEFAULT_YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

function getListingHero(context) {
  const currentItem =
    context.type === "group" ? context.group : context.category;

  return {
    desktopImage:
      currentItem.bannerDesktop ||
      context.category.bannerDesktop ||
      "/images/products/banners/product-listing-hero-desktop.avif",

    mobileImage:
      currentItem.bannerMobile ||
      currentItem.bannerDesktop ||
      context.category.bannerMobile ||
      context.category.bannerDesktop ||
      "/images/products/banners/product-listing-hero-mobile.avif",

    youtubeVideoId:
      currentItem.youtubeVideoId ||
      context.category.youtubeVideoId ||
      DEFAULT_YOUTUBE_VIDEO_ID,
  };
}

function getProductTitle(product) {
  if (typeof product === "string") return product;
  return product.name || product.title || "";
}

function getProductImage(product) {
  if (typeof product === "object" && product?.image) return product.image;
  return "";
}

function getProductPrice(product) {
  if (typeof product === "object" && product?.price) return product.price;
  return "Call for Price";
}

function getProductDesc(product, fallback = "") {
  if (typeof product === "object" && product?.desc) return product.desc;

  return (
    fallback ||
    "Professional commercial display solution for business, advertising and customer engagement."
  );
}

function getGroupImage(group) {
  const productWithImage = group.products?.find((product) =>
    getProductImage(product),
  );

  return getProductImage(productWithImage);
}

// function productDetailsHref(productName) {
//   return `/products/details/${slugify(productName)}.html`;
// }

function productDetailsHref(product) {
  if (typeof product === "object" && product?.link) {
    return product.link;
  }

  return "#";
}
function createGroupHref(categoryHref, groupTitle) {
  const baseHref = categoryHref.replace(/\.html$/, "");
  return `${baseHref}/${slugify(groupTitle)}.html`;
}

function getCategorySlug(category) {
  return category.href
    .split("/")
    .filter(Boolean)
    .pop()
    .replace(/\.html$/, "");
}

function collectCategories() {
  return navItems
    .filter((item) => item.type === "productMegaTree")
    .flatMap((item) =>
      item.categories.flatMap((mainCategory) =>
        mainCategory.children.map((category) => ({
          ...category,
          parentLabel: item.label,
          mainLabel: mainCategory.label,
        })),
      ),
    );
}

function getCurrentPageContext() {
  const parts = window.location.pathname.split("/").filter(Boolean);

  const categorySlug = parts[1]?.replace(/\.html$/, "");
  const groupSlug = parts[2]?.replace(/\.html$/, "");

  const categories = collectCategories();
  const category = categories.find(
    (item) =>
      getCategorySlug(item) === categorySlug || item.id === categorySlug,
  );

  if (!category) return null;

  if (!groupSlug) {
    return {
      type: "category",
      category,
      group: null,
    };
  }

  const group = category.groups?.find(
    (item) => slugify(item.title) === groupSlug,
  );

  if (!group) return null;

  return {
    type: "group",
    category,
    group,
  };
}

function getProducts(context) {
  if (context.type === "group") {
    return context.group.products || [];
  }

  return context.category.groups.flatMap((group) => group.products || []);
}

function renderImage(product) {
  const image = getProductImage(product);
  const title = getProductTitle(product);

  if (!image) {
    return `
      <div class="flex h-full w-full items-center justify-center bg-[#f7fbff]">
        <div class="text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-blue-100 bg-white text-[24px] text-[#0050a8]">
            🖼
          </div>
          <p class="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#0050a8]">
            Image Missing
          </p>
        </div>
      </div>
    `;
  }

  return `
    <img
      src="${image}"
      alt="${title}"
      loading="lazy"
      decoding="async"
      class="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
    />
  `;
}

function productCard(product) {
  const title = getProductTitle(product);

  return `
    <a
     href="${productDetailsHref(product)}"
      class="group flex h-full flex-col overflow-hidden rounded-[12px] border border-[#dbe8f5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,87,216,0.14)]"
    >
      <div class="relative h-[185px] shrink-0 bg-white">
        ${renderImage(product)}
      </div>

      <div class="flex flex-1 flex-col p-4">
        <h3 class="text-[15px] font-medium leading-6 text-[#0b1f33]">
          ${title}
        </h3>

        <p class="mt-2 text-[12px] leading-5 text-[#5d6b7a]">
          ${getProductDesc(product)}
        </p>

        <span class="mt-auto inline-flex pt-4 text-[13px] font-medium text-[#0057d8]">
          Learn More →
        </span>
      </div>
    </a>
  `;
}

// absolute bottom-8 left-1/2 grid h-[66px] w-[66px] -translate-x-1/2 place-items-center rounded-full border-2 border-red-500 bg-transparent text-red-500 shadow-[0_14px_36px_rgba(15,23,42,0.22)] transition duration-300 hover:scale-105 hover:bg-red-500 hover:text-white md:bottom-auto md:left-[75%] md:top-1/2 md:h-[72px] md:w-[72px] md:-translate-x-1/2 md:-translate-y-1/2
function renderBanner(context, productCount) {
  const title =
    context.type === "group" ? context.group.title : context.category.label;

  const eyebrow =
    context.type === "group"
      ? context.category.label
      : context.category.parentLabel;

  const hero = getListingHero(context);

  return `
    <section
      class="relative isolate overflow-hidden border-b border-[#dce8f5] bg-[#eef6ff]"
    >
      <picture class="absolute inset-0 h-full w-full">
        <source
          media="(max-width: 767px)"
          srcset="${hero.mobileImage}"
        />

        <img
          src="${hero.desktopImage}"
          alt="${title}"
          loading="eager"
          decoding="async"
          onerror="this.style.display='none'"
          class="h-full w-full object-cover object-[70%_center]"
        />
      </picture>

      <div
        class="absolute inset-0 bg-gradient-to-b from-[#eef6ff] via-[#eef6ff]/90 to-[#eef6ff]/30 md:bg-gradient-to-r md:from-[#eef6ff] md:via-[#eef6ff]/90 md:to-transparent"
      ></div>

      <div
        class="relative z-10 mx-auto flex min-h-[520px] max-w-[1320px] items-start px-4 pb-28 pt-14 sm:px-6 md:min-h-[390px] md:items-center md:px-8 md:py-14"
      >
        <div class="max-w-[690px]">
          <p
            class="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0057d8] sm:text-[12px]"
          >
            ${eyebrow}
          </p>

          <h1
            class="mt-3 max-w-[640px] text-[30px] font-medium leading-[1.15] text-[#0b1f33] sm:text-[34px] md:text-[42px]"
          >
            ${title}
          </h1>

          <div class="mt-4 h-[3px] w-20 rounded-full bg-[#0498e8]"></div>

          <p
            class="mt-5 max-w-[650px] text-[14px] leading-7 text-[#334e68] md:text-[15px] md:leading-8"
          >
            Explore ${productCount} professional ${title} products for digital
            signage, commercial display, advertising and business
            communication projects.
          </p>
        </div>

        <button
          type="button"
          data-product-video-open
          data-youtube-id="${hero.youtubeVideoId}"
          aria-label="Play ${title} video"
    class="absolute bottom-9 left-1/2 grid h-[64px] w-[64px] -translate-x-1/2 place-items-center rounded-full border-2 border-[#0068d9] bg-transparent text-[#0068d9] shadow-[0_14px_38px_rgba(0,104,217,0.22)] transition duration-300 hover:scale-105 hover:bg-[#0068d9] hover:text-white md:bottom-auto md:left-[76%] md:top-1/2 md:h-[72px] md:w-[72px] md:-translate-x-1/2 md:-translate-y-1/2"
        >
          <svg
            class="h-7 w-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9 6.5v11l8.5-5.5L9 6.5Z"></path>
          </svg>
        </button>
      </div>
    </section>
  `;
}

function renderProductVideoModal() {
  return `
    <div
      data-product-video-modal
      aria-hidden="true"
      class="fixed inset-0 z-[100] hidden items-center justify-center px-3 py-6 sm:px-6"
    >
      <button
        type="button"
        data-product-video-close
        aria-label="Close video"
        class="absolute inset-0 h-full w-full cursor-default bg-black/80"
      ></button>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product video"
        class="relative z-10 w-full max-w-[920px] overflow-hidden rounded-[14px] border border-white/10 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
      >
        <button
          type="button"
          data-product-video-close
          aria-label="Close video"
          class="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-[25px] font-medium leading-none text-white transition hover:bg-white hover:text-black"
        >
          ×
        </button>

        <div class="aspect-video w-full bg-black">
          <iframe
            data-product-video-frame
            class="h-full w-full"
            src=""
            title="Product video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  `;
}

function renderCategoryList(context) {
  const activeGroupTitle = context.group?.title || "";

  return `
    <section class="bg-white py-10">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div class="mb-5 border-b border-[#d8e6f7] pb-4">
          <h2 class="text-[24px] font-medium text-[#0b1f33]">
            Browse by Category
          </h2>

          <div class="mt-4 h-[2px] w-10 bg-[#0057d8]"></div>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          ${context.category.groups
            .map((group) => {
              const isActive = group.title === activeGroupTitle;
              const image = getGroupImage(group);
              const href = createGroupHref(context.category.href, group.title);

              return `
                <a
                  href="${href}"
                  class="group overflow-hidden rounded-[6px] border bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] ${
                    isActive
                      ? "border-[#0057d8]"
                      : "border-[#dbe8f5] hover:border-[#9cc4ff]"
                  }"
                >
                  <div class="h-[122px] bg-[#f5fbff]">
                    ${
                      image
                        ? `
                          <img
                            src="${image}"
                            alt="${group.title}"
                            loading="lazy"
                            decoding="async"
                            class="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                          />
                        `
                        : `
                          <div class="flex h-full w-full items-center justify-center bg-[#f7fbff] text-[12px] font-medium text-[#0057d8]">
                            Category
                          </div>
                        `
                    }
                  </div>

                  <div class="flex min-h-[48px] items-center justify-center px-3 py-3 text-center">
                    <h3 class="text-[14px] font-medium leading-5 text-[#0b1f33]">
                      ${group.title}
                    </h3>
                  </div>
                </a>
              `;
            })
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderProducts(context, products) {
  const title =
    context.type === "group" ? context.group.title : context.category.label;

  return `
    <section class="bg-[#f7fbff] py-10">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div class="mb-6">
          <p class="text-[12px] font-medium uppercase tracking-[0.22em] text-[#0057d8]">
            Products
          </p>

          <h2 class="mt-2 text-[26px] font-medium text-[#0b1f33]">
            ${title} Products
          </h2>

      
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          ${products.map(productCard).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderSeoText(context) {
  const title =
    context.type === "group" ? context.group.title : context.category.label;

  return `
    <section class="bg-white py-12">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div class="max-w-[900px]">
          <h2 class="text-[28px] font-medium text-[#0b1f33]">
            ${title} in Bangladesh
          </h2>

          <p class="mt-4 text-[15px] leading-8 text-[#5d6b7a]">
            GCTL provides ${title} solutions for commercial display, retail advertising, office communication, information display and customer engagement projects. Our product range is suitable for businesses that need reliable display performance, clean installation support and professional after-sales service.
          </p>

          <p class="mt-4 text-[15px] leading-8 text-[#5d6b7a]">
            Whether you need a single display or a complete digital signage project, our team can help you choose the right size, brightness, installation type and display configuration.
          </p>
        </div>
      </div>
    </section>
  `;
}

function renderFaq(context) {
  const title =
    context.type === "group" ? context.group.title : context.category.label;

  const faqs = [
    {
      q: `What is ${title}?`,
      a: `${title} is a professional display solution used for advertising, information sharing and commercial communication.`,
    },
    {
      q: `Where can I use ${title}?`,
      a: `You can use ${title} in retail stores, offices, malls, showrooms, restaurants, hospitals, educational spaces and public information areas.`,
    },
    {
      q: `Can GCTL help me choose the right product?`,
      a: `Yes, GCTL can help you choose the right display size, brightness, installation type and configuration based on your project needs.`,
    },
  ];

  return `
    <section class="bg-[#f7fbff] py-12">
      <div class="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
        <div class="mb-6 text-center">
          <p class="text-[12px] font-medium uppercase tracking-[0.22em] text-[#0057d8]">
            FAQ
          </p>

          <h2 class="mt-2 text-[28px] font-medium text-[#0b1f33]">
            Frequently Asked Questions
          </h2>
        </div>

        <div class="space-y-3">
          ${faqs
            .map(
              (faq, index) => `
                <div class="rounded-xl border border-[#dbe8f5] bg-white">
                  <button
                    type="button"
                    data-listing-faq-btn
                    class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium text-[#0b1f33]"
                  >
                    <span>${faq.q}</span>
                    <span class="text-[20px] text-[#0057d8]">${index === 0 ? "−" : "+"}</span>
                  </button>

                  <div data-listing-faq-panel class="${index === 0 ? "" : "hidden"} px-5 pb-5 text-[14px] leading-7 text-[#5d6b7a]">
                    ${faq.a}
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderNotFound(root) {
  root.innerHTML = `
    <section class="bg-[#f7fbff] py-24">
      <div class="mx-auto max-w-[900px] px-4 text-center">
        <h1 class="text-[34px] font-medium text-[#0b1f33]">
          Product Listing Page Not Found
        </h1>

        <p class="mt-4 text-[15px] leading-7 text-slate-600">
          This page does not match any category or product group from nav-data.js.
        </p>

        <a href="/" class="mt-8 inline-flex rounded-xl bg-[#0057d8] px-6 py-3 text-[14px] font-medium text-white hover:bg-[#003f9e]">
          Back to Home
        </a>
      </div>
    </section>
  `;
}

function initListingFaq() {
  const buttons = document.querySelectorAll("[data-listing-faq-btn]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      const icon = button.querySelector("span:last-child");

      if (!panel || !icon) return;

      const isHidden = panel.classList.contains("hidden");

      panel.classList.toggle("hidden", !isHidden);
      icon.textContent = isHidden ? "−" : "+";
    });
  });
}

function initProductVideoModal() {
  const openButton = document.querySelector("[data-product-video-open]");

  const modal = document.querySelector("[data-product-video-modal]");

  const iframe = modal?.querySelector("[data-product-video-frame]");

  const closeButtons = modal?.querySelectorAll("[data-product-video-close]");

  if (!openButton || !modal || !iframe || !closeButtons?.length) {
    return;
  }

  function openVideoModal() {
    const youtubeId = openButton.dataset.youtubeId?.trim();

    if (!youtubeId) return;

    iframe.src =
      `https://www.youtube-nocookie.com/embed/${youtubeId}` +
      "?autoplay=1&rel=0&modestbranding=1";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("overflow-hidden");
  }

  function closeVideoModal() {
    iframe.src = "";

    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("overflow-hidden");
  }

  openButton.addEventListener("click", openVideoModal);

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeVideoModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeVideoModal();
    }
  });
}

export function initProductListingPage() {
  const root = document.querySelector("#product-listing-root");
  if (!root) return;

  const context = getCurrentPageContext();

  if (!context) {
    renderNotFound(root);
    return;
  }

  const products = getProducts(context);
  const pageTitle =
    context.type === "group" ? context.group.title : context.category.label;

  document.title = `${pageTitle} | GCTL LED Display Solutions`;

  root.innerHTML = `
  ${renderBanner(context, products.length)}
  ${renderCategoryList(context)}
  ${renderProducts(context, products)}
  ${renderSeoText(context)}
  ${renderFaq(context)}
  ${renderProductVideoModal()}
`;

  initListingFaq();
  initProductVideoModal();
}
