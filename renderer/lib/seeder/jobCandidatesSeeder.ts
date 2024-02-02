import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import { faker } from '@faker-js/faker';

const seedJobCandidates = async () => {
  try {
    const generateCandidate = () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      dob: faker.date.past(),
    });

    const candidates = Array.from({ length: 10 }, generateCandidate);

    for (let i = 0 ; i < candidates.length ; i++) {
      
      
      const uid = `CANDIDATE-${i}`;

      const candidateRef = doc(db, 'jobCandidates', uid);
      await setDoc(candidateRef, {
        name: candidates[i].name,
        email: candidates[i].email,
        phoneNumber: candidates[i].phoneNumber,
        dob: candidates[i].dob,
      });

    }

    console.log('Seed complete');
  } catch (error) {
    console.error('Seed failed:', error);
  }
};

export default seedJobCandidates;