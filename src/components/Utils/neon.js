import { neon as neonClient } from '@neondatabase/serverless';

export const neon = neonClient(import.meta.env.VITE_NEON_DATABASE_URL);