import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const userPassword = req.headers['authorization'];
  if (!userPassword || userPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin password' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing required query parameter: id' });
  }

  try {
    const databaseUrl = process.env.NEON_DATABASE_URL;
    const sql = neon(databaseUrl);

    await sql`
      DELETE FROM map_locations
      WHERE id = ${id}
    `;

    return res.status(200).json({ success: true, message: `Location ${id} deleted successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete location from Neon' });
  }
}