import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const databaseUrl = process.env.NEON_DATABASE_URL; 
    const sql = neon(databaseUrl);
    
    const data = await sql`SELECT id, name, type, lat, lng, schedule FROM map_locations`;
    
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch map data" });
  }
}