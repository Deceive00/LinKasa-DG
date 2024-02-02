// seeder.js
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";


const seedData = [
  {
    title: 'Software Engineer',
    description: 'Exciting software engineering position with a leading tech company.',
    location: 'San Francisco, CA',
    qualifications: ['Bachelor\'s degree in Computer Science', 'Strong problem-solving skills'],
    skills: ['JavaScript', 'React', 'Node.js'],
    deadline: new Date('2023-12-31'),
    salary: 100,
    seats: 5,
    applicants: ['John Doe', 'Jane Smith', 'Bob Johnson'],
  },
  {
    title: 'Data Analyst',
    description: 'Opportunity for a skilled data analyst to join our analytics team.',
    location: 'New York, NY',
    qualifications: ['Bachelor\'s degree in Statistics or related field', 'Experience with data visualization tools'],
    skills: ['SQL', 'Python', 'Tableau'],
    deadline: new Date('2023-12-15'),
    salary: 80,
    seats: 3,
    applicants: ['Alice Brown', 'Charlie Davis'],
  },
];
export const seedCollection = async () => {
  const collectionRef = collection(db, 'jobVacancy');

  seedData.forEach(async (data) => {
    await addDoc(collectionRef, data);
  });

  console.log('Seeding completed.');
};

