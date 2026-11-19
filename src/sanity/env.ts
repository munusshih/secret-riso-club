// Public configuration for this SRC project, shared by Next.js and Studio.
// Environment variables can override these values for another project/dataset.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8kwmm0xx";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01";
