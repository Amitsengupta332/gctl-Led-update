import { navItems } from "../data/nav-data.js";

// Keep the homepage's existing eight sections and their exact visual styles.
// The product data itself now comes from the matching nav-data.js category.
const homepageSections = [
  {
    title: "Floor Standing Signage",
    navCategory: "Floor Standing Digital Signage",
    bg: "bg-white",
  },
  {
    title: "Interactive Touch Panel",
    navCategory: "Interactive Touch Panel",
    bg: "bg-[#f7fbff]",
  },
  {
    title: "K-Type Information Kiosk",
    navCategory: "K-Type Information Kiosk",
    bg: "bg-white",
  },
  {
    title: "LCD Video Wall",
    navCategory: "LCD Video Wall",
    bg: "bg-[#f7fbff]",
  },
  {
    title: "Self Service Touch Kiosk",
    navCategory: "Self Service Touch Kiosk",
    bg: "bg-white",
  },
  {
    title: "Wall Mount Display",
    navCategory: "Wall Mount Android Display",
    bg: "bg-[#f7fbff]",
  },
  {
    title: "Portable Signage Poster",
    navCategory: "Portable Digital Signage Poster",
    bg: "bg-white",
  },
  {
    title: "Advertising Billboard",
    navCategory: "Digital Advertising Billboard",
    bg: "bg-[#f7fbff]",
  },
];

const navCategories = navItems
  .filter((item) => item.type === "productMegaTree")
  .flatMap((item) => item.categories || [])
  .flatMap((category) => category.children || []);

export const productSections = homepageSections.map((section) => {
  const category = navCategories.find(
    (item) => item.label === section.navCategory,
  );

  return {
    title: section.title,
    link: category?.href || "#",
    bg: section.bg,
    products: (category?.groups || [])
      .flatMap((group) => group.products || [])
      // A product without a custom HTML detail URL must not create a dead link.
      .filter(
        (product) =>
          typeof product?.name === "string" &&
          typeof product?.link === "string" &&
          product.link.startsWith("/products/") &&
          product.link.endsWith(".html"),
      )
      .map((product) => ({
        name: product.name,
        desc:
          product.desc ||
          "Explore this product's details and specifications.",
        image: product.image || "",
        link: product.link,
        badge: product.badge || "",
        badgeClass: product.badgeClass || "",
      })),
  };
});
