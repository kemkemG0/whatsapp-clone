import { initializeApp, getApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: measurementId.env.measurementId
};

const app = (()=>{
    try{
        return getApp();
    }catch{
        return initializeApp(firebaseConfig);
    }
    })()

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {db,auth,provider};
