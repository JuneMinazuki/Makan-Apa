import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const userPassword = req.headers['authorization'];
  if (!userPassword || userPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing admin password" });
  }
  
  try {
    const databaseUrl = process.env.NEON_DATABASE_URL; 
    const sql = neon(databaseUrl);
    
    const data = await sql`SELECT id, name, type, lat, lng, schedule FROM map_locations`;
    
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch admin data" });
  }
}