import fs from "fs";
import path from "path";
import { navItems } from "../src/data/nav-data.js";

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createGroupHref(categoryHref, groupTitle) {
  const baseHref = categoryHref.replace(/\.html$/, "");
  return `${baseHref}/${slugify(groupTitle)}.html`;
}

function createHtml(title) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | GCTL LED Display Solutions</title>
  </head>

  <body class="bg-white text-slate-900">
    <div
      data-component="/components/navbar.html"
      data-critical="true"
      class="min-h-[102px] lg:min-h-[110px]"></div>

    <main id="product-listing-root"></main>

    <div data-component="/components/footer.html"></div>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`;
}

function createFileFromHref(href, title) {
  const cleanHref = href.replace(/^\//, "");
  const filePath = path.join(process.cwd(), cleanHref);
  const folderPath = path.dirname(filePath);

  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFileSync(filePath, createHtml(title));

  console.log(`Created: ${cleanHref}`);
}

function generateProductListingPages() {
  navItems.forEach((item) => {
    if (item.type !== "productMegaTree") return;

    item.categories?.forEach((mainCategory) => {
      mainCategory.children?.forEach((category) => {
        if (!category.href) return;

        createFileFromHref(category.href, category.label);

        category.groups?.forEach((group) => {
          const groupHref = createGroupHref(category.href, group.title);
          createFileFromHref(groupHref, group.title);
        });
      });
    });
  });
}

generateProductListingPages();