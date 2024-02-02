import * as React from 'react';
import { Router, useRouter } from 'next/router';
import { auth } from '../../firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function Home() {
  const router = useRouter();
  React.useEffect(() => {
    router.push('/auth/login');
  }, []);
  return null;
}