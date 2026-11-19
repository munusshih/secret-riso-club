import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

loadEnvConfig(process.cwd());
const { projectId, dataset } = await import("./src/sanity/env");

export default defineCliConfig({
  typegen: { path: "./src/**/*.{ts,tsx}", schema: "./sanity.schema.json", generates: "./src/sanity/types.ts" },
  api: {
    projectId,
    dataset,
  },
});
