import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import {
  resolve,
  relative,
} from "node:path";

import {
  existsSync,
  readdirSync,
} from "node:fs";

/* =========================================================
   HELPER
   একটি folder-এর ভেতরের সব HTML file recursively collect করবে
========================================================= */

function addHtmlFiles(directory, rootDir, inputs) {
  if (!existsSync(directory)) return;

  const entries = readdirSync(directory, {
    withFileTypes: true,
  });

  entries.forEach((entry) => {
    const fullPath = resolve(
      directory,
      entry.name,
    );

    // Nested folder হলে আবার scan করবে
    if (entry.isDirectory()) {
      addHtmlFiles(
        fullPath,
        rootDir,
        inputs,
      );

      return;
    }

    // শুধু HTML file
    if (
      !entry.isFile() ||
      !entry.name.endsWith(".html")
    ) {
      return;
    }

    const inputName = relative(
      rootDir,
      fullPath,
    )
      .replace(/\\/g, "/")
      .replace(/\.html$/, "");

    inputs[inputName] = fullPath;
  });
}


/* =========================================================
   BUILD HTML INPUTS
========================================================= */

function getHtmlInputs() {
  const rootDir = process.cwd();

  const inputs = {};

  /* ---------------------------------------------------------
     1. ROOT HTML FILES
     index.html
     about.html
     contact.html
     projects.html
     etc.
  --------------------------------------------------------- */

  const rootFiles = readdirSync(rootDir, {
    withFileTypes: true,
  });

  rootFiles.forEach((entry) => {
    if (
      !entry.isFile() ||
      !entry.name.endsWith(".html")
    ) {
      return;
    }

    const inputName =
      entry.name.replace(
        /\.html$/,
        "",
      );

    inputs[inputName] = resolve(
      rootDir,
      entry.name,
    );
  });


  /* ---------------------------------------------------------
     2. NESTED HTML FOLDERS

     products/
     professional-services/
  --------------------------------------------------------- */

  const htmlFolders = [
    "products",
    "professional-services",
  ];

  htmlFolders.forEach((folderName) => {
    addHtmlFiles(
      resolve(rootDir, folderName),
      rootDir,
      inputs,
    );
  });


  return inputs;
}


/* =========================================================
   CLEAN / DYNAMIC ROUTES
========================================================= */

function cleanRoutes() {
  function routeMiddleware(
    req,
    res,
    next,
  ) {
    if (!req.url) {
      next();
      return;
    }

    const pathname =
      req.url.split("?")[0];


    /* -------------------------------------------------------
       BLOG DETAILS
    ------------------------------------------------------- */

    if (
      pathname.startsWith("/blogs/")
    ) {
      req.url =
        "/blog-details.html";
    }


    /* -------------------------------------------------------
       VIDEO DETAILS
    ------------------------------------------------------- */

    else if (
      pathname.startsWith("/videos/")
    ) {
      req.url =
        "/video-details.html";
    }


    /* -------------------------------------------------------
       PROJECT DETAILS
    ------------------------------------------------------- */

    else if (
      pathname.startsWith(
        "/project-details/",
      )
    ) {
      req.url =
        "/project-details.html";
    }


    /* -------------------------------------------------------
       PRODUCT DETAILS
    ------------------------------------------------------- */

    else if (
      pathname.startsWith(
        "/products/details/",
      )
    ) {
      req.url =
        "/index.html";
    }


    next();
  }


  return {
    name: "clean-routes",

    configureServer(server) {
      server.middlewares.use(
        routeMiddleware,
      );
    },

    configurePreviewServer(server) {
      server.middlewares.use(
        routeMiddleware,
      );
    },
  };
}


/* =========================================================
   VITE CONFIG
========================================================= */

export default defineConfig({
  appType: "mpa",

  // যদি domain root-এ deploy করো
  base: "/",

  plugins: [
    tailwindcss(),
    cleanRoutes(),
  ],


  /* =======================================================
     BUILD
  ======================================================= */

  build: {
    outDir: "dist",

    emptyOutDir: true,

    rollupOptions: {
      input: getHtmlInputs(),
    },
  },
});