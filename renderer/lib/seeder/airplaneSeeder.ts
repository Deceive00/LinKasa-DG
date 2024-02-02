// seeder.js
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

// Define the Airplane type

const seedData: Airplane[] = [
  {
    id:'',
    status: 'Not flying',
    company: 'Lion Air',
  },
  {
    id:'',
    status: 'Not flying',
    company: 'Garuda Airlines',
  },

];

const getRandomNumber = () => String(Math.floor(Math.random() * 1000)).padStart(3, '0');

const getCompanyId = (companyName: string) =>
  companyName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase()) 
    .join('');

export const seedCollection = async () => {
  const collectionRef = collection(db, 'airplanes');

  seedData.forEach(async (data) => {
    const companyId = getCompanyId(data.company);
    const randomNum = getRandomNumber();
    const docId = `${companyId}_${randomNum}`;

    await addDoc(collectionRef, { ...data, id: docId });
  });

  console.log('Seeding completed.');
};
