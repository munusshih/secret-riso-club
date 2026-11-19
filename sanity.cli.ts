import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

loadEnvConfig(process.cwd());

export default defineCliConfig({
  typegen: { path: "./src/**/*.{ts,tsx}", schema: "./sanity.schema.json", generates: "./src/sanity/types.ts" },
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
