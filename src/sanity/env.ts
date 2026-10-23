function required(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing ${name}. Set it in .env.local and restart Next.js.`);
  return value;
}

export const projectId = required(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, "NEXT_PUBLIC_SANITY_PROJECT_ID");
export const dataset = required(process.env.NEXT_PUBLIC_SANITY_DATASET, "NEXT_PUBLIC_SANITY_DATASET");
export const apiVersion = required(process.env.NEXT_PUBLIC_SANITY_API_VERSION, "NEXT_PUBLIC_SANITY_API_VERSION");
