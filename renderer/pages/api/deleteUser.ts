import { NextApiRequest, NextApiResponse } from 'next';
import { admin } from './firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    
    const { userIdToDelete } = req.body;
    console.log('ini userid' + userIdToDelete);

    await admin.auth().deleteUser(userIdToDelete);

    res.status(201).json("Success");
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });

  }
}
