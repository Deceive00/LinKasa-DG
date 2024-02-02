
import { NextApiRequest, NextApiResponse } from 'next';
import { admin } from './firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    
    res.status(201).json({ uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
