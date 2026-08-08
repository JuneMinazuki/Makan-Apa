import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Authorize Admin Password
  const userPassword = req.headers['authorization'];
  if (!userPassword || userPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin password' });
  }

  const { id, name, type, lat, lng, schedule } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing required location ID' });
  }

  try {
    const databaseUrl = process.env.NEON_DATABASE_URL;
    const sql = neon(databaseUrl);

    await sql`
      UPDATE map_locations
      SET 
        name = ${name},
        type = ${type},
        lat = ${lat},
        lng = ${lng},
        schedule = ${schedule}
      WHERE id = ${id}
    `;

    return res.status(200).json({ success: true, message: `Location ${id} updated successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update location' });
  }
}