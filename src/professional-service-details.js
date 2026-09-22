import { PROFESSIONAL_SERVICE_DETAILS } from "./data/professional-service-details-data.js";

const ICONS = {
  shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>`,
  eye: `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>`,
  clipboard: `<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2"/><path d="m9 12 2 2 4-4"/><path d="M9 17h6"/>`,
  document: `<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M9 12h6M9 16h6"/>`,
  chart: `<path d="M4 20V10M10 20V5M16 20v-7M22 20H2"/><path d="m4 8 5-4 5 3 7-6"/>`,
  search: `<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1-2.9 2.9-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1V21h-4v-.1a1.7 1.7 0 0 0-.4-1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.8.3l-.1.1-2.9-2.9.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4H2v-4h.1a1.7 1.7 0 0 0 1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1 2.9-2.9.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1V3h4v.1a1.7 1.7 0 0 0 .4 1 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.8-.3l.1-.1 2.9 2.9-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1 .4h.1v4H21a1.7 1.7 0 0 0-1 .5Z"/>`,
  tools: `<path d="M14.7 6.3a4 4 0 0 0-5-5L7 4l3 3 2.7-2.7"/><path d="m10 7-7 7a2.1 2.1 0 0 0 3 3l7-7"/><path d="m14 14 7 7M17 17l3-3"/>`,
  ruler: `<path d="M4 19 19 4l3 3L7 22H4z"/><path d="m14 9 2 2M11 12l2 2M8 15l2 2"/>`,
  bolt: `<path d="m13 2-8 12h7l-1 8 8-12h-7z"/>`,
  design: `<path d="m14 5 5 5"/><path d="M3 21l5.5-1.5L19 9l-4-4L4.5 15.5z"/><path d="m12 7 5 5"/>`,
  monitor: `<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>`,
  network: `<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v4m-1.5 0-4 5m7-5 4 5"/>`,
  refresh: `<path d="M20 11a8 8 0 0 0-14.9-4L3 10"/><path d="M3 4v6h6"/><path d="M4 13a8 8 0 0 0 14.9 4L21 14"/><path d="M15 14h6v6"/>`,
  calendar: `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>`,
  users: `<circle cx="9" cy="7" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 7M18 14a6 6 0 0 1 4 7"/>`,
  training: `<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>`,
  headset: `<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-7zM20 13a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v-7z"/><path d="M18 20c0 1-2 2-4 2"/>`,
  laptop: `<rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 19h20"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  award: `<circle cx="12" cy="8" r="5"/><path d="M8.5 12 7 22l5-3 5 3-1.5-10"/><path d="m10 8 1.3 1.3L14 6.5"/>`,
};

function icon(name, className = "h-6 w-6") {
  const paths = ICONS[name] || ICONS.shield;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}

function renderService(data) {
  const badgeHtml = data.badges
    .map(
      (item) => `
        <div class="flex min-h-[58px] items-center gap-3 border-r border-[#e5edf8] px-3 last:border-r-0 sm:px-4">
          <div class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef6ff] text-[#0067e8]">
            ${icon(item.icon, "h-5 w-5")}
          </div>

          <span class="text-[11px] font-bold leading-[1.35] text-[#0b1d3e]">
            ${escapeHtml(item.label)}
          </span>
        </div>
      `,
    )
    .join("");

  const benefitsHtml = data.benefits
    .map(
      (item) => `
        <article class="rounded-[12px] border border-[#e3ebf5] bg-white p-5 shadow-[0_8px_30px_rgba(15,52,96,0.035)] sm:p-6">
          <div class="grid h-12 w-12 place-items-center rounded-full bg-[#eef6ff] text-[#0067e8]">
            ${icon(item.icon, "h-6 w-6")}
          </div>

          <h3 class="mt-4 text-[15px] font-extrabold text-[#07152f]">
            ${escapeHtml(item.title)}
          </h3>

          <p class="mt-2 text-[12px] leading-5 text-slate-600">
            ${escapeHtml(item.text)}
          </p>
        </article>
      `,
    )
    .join("");

  const processHtml = data.process
    .map(
      (item, index) => `
        <article class="relative text-center">
          <span class="mx-auto grid h-8 w-8 place-items-center rounded-full border border-[#dbe8f8] bg-white text-[10px] font-extrabold text-[#0067e8] shadow-sm">
            ${String(index + 1).padStart(2, "0")}
          </span>

          <div class="relative mt-4">
            ${
              index < data.process.length - 1
                ? '<span class="absolute left-[58%] top-7 hidden h-px w-[86%] border-t border-dashed border-[#bdd5f2] lg:block"></span>'
                : ""
            }

            <div class="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eef6ff] text-[#0067e8]">
              ${icon(item.icon, "h-7 w-7")}
            </div>
          </div>

          <h3 class="mt-4 text-[14px] font-extrabold text-[#07152f]">
            ${escapeHtml(item.title)}
          </h3>

          <p class="mx-auto mt-2 max-w-[190px] text-[11px] leading-[1.6] text-slate-600">
            ${escapeHtml(item.text)}
          </p>
        </article>
      `,
    )
    .join("");

  const includedHtml = data.included
    .map(
      (item) => `
        <li class="flex gap-3 border-b border-slate-100 py-2.5 last:border-b-0">
          <span class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#0067e8] text-white">
            <svg
              viewBox="0 0 20 20"
              class="h-2.5 w-2.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <path d="m5 10 3 3 7-7"></path>
            </svg>
          </span>

          <span class="text-[11px] leading-5 text-slate-600">
            ${escapeHtml(item)}
          </span>
        </li>
      `,
    )
    .join("");

  const whyHtml = data.why
    .map(
      (item) => `
        <div class="flex gap-3">
          <span class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#0067e8] text-white">
            <svg
              viewBox="0 0 20 20"
              class="h-2.5 w-2.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <path d="m5 10 3 3 7-7"></path>
            </svg>
          </span>

          <div>
            <h3 class="text-[12px] font-extrabold text-[#005ed8]">
              ${escapeHtml(item.title)}
            </h3>

            <p class="mt-1 text-[10px] leading-5 text-slate-600">
              ${escapeHtml(item.text)}
            </p>
          </div>
        </div>
      `,
    )
    .join("");

  const heroPosition = escapeHtml(data.heroObjectPosition || "center");
  const whyPosition = escapeHtml(data.whyChooseObjectPosition || "center");

  return `
    <section class="bg-white text-[#07152f]">
      <!-- =====================================================
        BREADCRUMB
      ====================================================== -->
      <div class="border-b border-[#edf2f7] bg-[#f8fbff]">
        <div class="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 px-5 py-4 text-[10px] font-semibold text-slate-500 sm:px-8 lg:px-10">
          <a
            href="/index.html"
            class="transition hover:text-[#0067e8]"
          >
            Home
          </a>

          <span aria-hidden="true">›</span>

          <a
            href="/index.html#professional-services"
            class="transition hover:text-[#0067e8]"
          >
            Professional Services
          </a>

          <span aria-hidden="true">›</span>

          <span class="text-[#1c2a44]">
            ${escapeHtml(data.title)}
          </span>
        </div>
      </div>

      <!-- =====================================================
        HERO
      ====================================================== -->
      <div class="relative overflow-hidden bg-gradient-to-r from-[#f8fbff] via-white to-[#edf5ff]">
        <div class="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-100/50 blur-[90px]"></div>

        <div class="mx-auto grid min-h-[500px] max-w-[1440px] items-stretch lg:grid-cols-[0.98fr_1.02fr]">
          <!-- LEFT -->
          <div class="relative z-10 flex items-center px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
            <div class="max-w-[620px]">
              <div class="flex items-center gap-4">
                <span class="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0067e8]">
                  ${escapeHtml(data.eyebrow)}
                </span>

                <span class="h-[2px] w-8 rounded-full bg-[#0067e8]"></span>
              </div>

              <h1 class="mt-4 text-[34px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#07152f] sm:text-[44px] lg:text-[48px]">
                ${escapeHtml(data.title)}
              </h1>

              <p class="mt-4 max-w-[610px] text-[13px] leading-6 text-slate-600 sm:text-[14px]">
                ${escapeHtml(data.description)}
              </p>

              <div class="mt-7 flex flex-wrap gap-3">
                <a
                  href="/contact.html"
                  class="inline-flex min-h-[46px] items-center justify-center gap-3 rounded-[6px] bg-[#0067e8] px-5 text-[12px] font-bold text-white shadow-[0_8px_24px_rgba(0,103,232,.2)] transition hover:-translate-y-0.5 hover:bg-[#0059c8]"
                >
                  ${escapeHtml(data.primaryCtaLabel || "Request Consultation")}
                  <span aria-hidden="true">→</span>
                </a>

                <a
                  href="/contact.html"
                  class="inline-flex min-h-[46px] items-center justify-center gap-3 rounded-[6px] border border-[#d8e4f3] bg-white px-5 text-[12px] font-bold text-[#0067e8] transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  ${escapeHtml(data.secondaryCtaLabel || "Talk to an Expert")}
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              <div class="mt-7 grid max-w-[610px] grid-cols-2 overflow-hidden rounded-[8px] border border-[#e2eaf4] bg-white/85 shadow-sm sm:grid-cols-4">
                ${badgeHtml}
              </div>
            </div>
          </div>

          <!-- HERO IMAGE: IMAGE 01 -->
          <div class="relative min-h-[360px] overflow-hidden lg:min-h-[500px]">
            <img
              src="${data.heroImage}"
              alt="${escapeHtml(data.heroAlt)}"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="absolute inset-0 h-full w-full object-cover"
              style="object-position:${heroPosition};"
              onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');"
            />

            <!-- fallback -->
            <div class="absolute inset-0 hidden bg-[radial-gradient(circle_at_70%_40%,#d8ebff_0,#eef6ff_33%,#f8fbff_68%,#ffffff_100%)]">
              <div class="absolute inset-0 grid place-items-center text-[#0067e8] opacity-50">
                ${icon("monitor", "h-28 w-28")}
              </div>
            </div>

            <div class="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-white via-white/65 to-transparent lg:block"></div>
            <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/50 to-transparent lg:hidden"></div>
          </div>
        </div>
      </div>

      <!-- =====================================================
        BODY
      ====================================================== -->
      <div class="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <!-- BENEFITS -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          ${benefitsHtml}
        </div>

        <!-- PROCESS -->
        <section class="mt-6 rounded-[12px] bg-gradient-to-r from-[#f5f9ff] via-white to-[#f1f7ff] px-5 py-7 sm:px-8 lg:px-10 lg:py-8">
          <div class="text-center">
            <h2 class="text-[20px] font-extrabold text-[#07152f] sm:text-[23px]">
              ${escapeHtml(data.processTitle || `Our ${data.title} Process`)}
            </h2>

            <p class="mt-2 text-[11px] text-slate-500">
              ${escapeHtml(
                data.processSubtitle ||
                  "A structured approach to deliver reliable, practical, and measurable outcomes.",
              )}
            </p>
          </div>

          <div class="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            ${processHtml}
          </div>
        </section>

        <!-- INCLUDED + WHY CHOOSE -->
        <div class="mt-6 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <!-- INCLUDED -->
          <section class="rounded-[12px] border border-[#e3ebf5] bg-white p-5 sm:p-7">
            <h2 class="text-[18px] font-extrabold text-[#07152f]">
              What&apos;s Included
            </h2>

            <p class="mt-1 text-[10px] text-slate-500">
              ${escapeHtml(
                data.includedSubtitle ||
                  "Comprehensive deliverables tailored to your project needs.",
              )}
            </p>

            <ul class="mt-4">
              ${includedHtml}
            </ul>
          </section>

          <!-- WHY CHOOSE -->
          <section class="relative overflow-hidden rounded-[12px] bg-gradient-to-br from-[#f4f9ff] via-white to-[#eaf4ff] p-5 sm:p-7 lg:min-h-[390px]">
            <div class="relative z-20 max-w-[58%] max-lg:max-w-none">
              <h2 class="text-[18px] font-extrabold text-[#07152f]">
                Why Choose GCTL LED
              </h2>

              <p class="mt-1 text-[10px] text-slate-500">
                ${escapeHtml(
                  data.whyChooseSubtitle ||
                    "Specialist expertise backed by practical project experience.",
                )}
              </p>

              <div class="mt-6 space-y-5">
                ${whyHtml}
              </div>
            </div>

            <!-- WHY CHOOSE IMAGE: IMAGE 02 -->
            <div class="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[46%] lg:block">
              <img
                src="${data.whyChooseImage}"
                alt="${escapeHtml(data.whyChooseAlt || "")}"
                loading="lazy"
                decoding="async"
                class="absolute inset-0 h-full w-full object-contain object-bottom"
                style="object-position:${whyPosition};"
                onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');"
              />

              <!-- fallback -->
              <div class="absolute inset-0 hidden">
                <div class="absolute bottom-7 right-8 grid h-40 w-40 place-items-center rounded-full border border-blue-100 bg-white/70 text-[#0067e8] shadow-[0_10px_40px_rgba(0,103,232,.08)]">
                  ${icon("shield", "h-20 w-20")}
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- CTA -->
        <section class="relative mt-6 overflow-hidden rounded-[10px] bg-gradient-to-r from-[#052d6f] via-[#053b86] to-[#06285f] px-5 py-6 text-white sm:px-8">
          <div class="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_40%,rgba(70,150,255,.55)_0,transparent_36%)]"></div>

          <div class="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-5">
              <div class="hidden h-16 w-16 shrink-0 place-items-center rounded-full border border-blue-300/30 text-blue-200 sm:grid">
                ${icon("headset", "h-8 w-8")}
              </div>

              <div>
                <h2 class="text-[18px] font-extrabold sm:text-[20px]">
                  ${escapeHtml(data.ctaTitle)}
                </h2>

                <p class="mt-1.5 max-w-[680px] text-[11px] leading-5 text-blue-100/85 sm:text-[12px]">
                  ${escapeHtml(data.ctaText)}
                </p>
              </div>
            </div>

            <a
              href="/contact.html"
              class="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-4 rounded-[6px] bg-white px-6 text-[13px] font-extrabold text-[#0067e8] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              ${escapeHtml(data.bottomCtaLabel || "Get Started")}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </div>
    </section>
  `;
}

export function initProfessionalServiceDetails() {
  const root = document.getElementById("professional-service-details-root");

  if (!root || root.dataset.ready === "true") return;

  const key =
    root.dataset.serviceKey ||
    document.body.dataset.serviceKey;

  const data = PROFESSIONAL_SERVICE_DETAILS[key];

  if (!data) {
    root.innerHTML = `
      <section class="mx-auto max-w-[1100px] px-5 py-24 text-center">
        <h1 class="text-3xl font-bold text-slate-900">
          Professional service not found
        </h1>

        <p class="mt-3 text-slate-500">
          Please check the service key used on this page.
        </p>
      </section>
    `;

    return;
  }

  root.dataset.ready = "true";
  root.innerHTML = renderService(data);
}
