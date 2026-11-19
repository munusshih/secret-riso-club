"use client";

import { defineConfig, defineSingleton } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "src-test",
  title: "SRC Test",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  document: {
    singletons: [defineSingleton({ documentId: "homepage", schemaType: "homepage" })],
  },
});
