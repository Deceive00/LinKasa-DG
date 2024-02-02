import { DocumentData, DocumentReference, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function getAllData(type : any){
  const usersCollection = collection(db, type);
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot
}

export async function fetchDataById(collectionName : string, idCollection : string) {

  const filterCollection = doc(db, collectionName, idCollection);
  const promise = await getDoc(filterCollection);
  
  return promise;
};

export const deleteItemByID = async (collectionName, itemIdToDelete, ) => {
  const itemDocRef = doc(db, collectionName, itemIdToDelete);

  try {
    await deleteDoc(itemDocRef);
    
    return '';
  } catch (error) {
    return error.message;
  }
};


export const uploadImage = async (filename, photo) => {
  const photoRef = ref(storage, filename);
  
  await uploadBytes(photoRef, photo);
  const downloadURL = await getDownloadURL(photoRef);
  return downloadURL;

}