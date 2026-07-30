import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, name, type, lat, lng, schedule } = req.body;

  if (!id || !name || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const databaseUrl = process.env.NEON_DATABASE_URL;
    const sql = neon(databaseUrl);

    await sql`
      INSERT INTO map_locations (id, name, type, lat, lng, schedule, is_approved)
      VALUES (${id}, ${name}, ${type}, ${lat}, ${lng}, ${schedule}, FALSE)
    `;

    return res.status(200).json({ success: true, message: 'Location submitted for approval!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to insert location into Neon' });
  }
}