import { auth } from "firebase-admin";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import Singleton from "../singleton";

const roles = Singleton.getInstance().getRoles();

const defaultPassword = 'rian1234';
const createUserProfile = async (_uid : any, _name : any, _role : any, _email : any) => {
  try {
    const userRef = doc(db, 'users', _uid);
    await setDoc(userRef, {
      name: _name,
      role: _role,
      email: _email,
    });

  } catch (error : any) {

  }
};

const handleSubmit = async (email, name, password, role) => {
  if((true)){
    try {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        createUserProfile(data.uid, name, role, email)
      } 
      else {

      }
    } 
    catch (error) {

    }
  }
};

export const seedUsers = async () => {
  try {
    for (const role of roles) {
      const email = `${role.split(' ').join('')}@linkasa.ac.id`.toLowerCase(); // Generating email from role
      const displayName = role;
      

      handleSubmit(email, role, defaultPassword, role);

      console.log(`User seeded: ${displayName} (${email})`);
    }
    console.log('Seed complete');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    process.exit();
  }
};

