import { getApps, initializeApp, cert } from 'firebase-admin/app';
import * as admin from "firebase-admin";
// const admin = require('firebase-admin');

let app;
const serviceAccount = require('./dg-linkasa-firebase-adminsdk-pez5u-15bd426734.json');

// if (!admin.apps.length) {
//   app = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://dg-linkasa.firebaseio.com', 
//   });
// }
if (!admin.apps.length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dg-linkasa.firebaseio.com',
  });
}
export { app, admin }