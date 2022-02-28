import '../styles/globals.css'
import {useAuthState} from "react-firebase-hooks/auth"
import {auth,db}from "../firebase"
import Login  from  './login';
import Loading from './loading';
import { doc, setDoc,Timestamp,serverTimestamp } from "firebase/firestore"; 
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [user,loading] = useAuthState(auth);

  useEffect( ()=>{
    if(user) {
      const docData = {
        email: user.email,
        lastSeen:serverTimestamp(),
        photoURL:user.photoURL
      };
      
      (async ()=>{
        await setDoc(doc(db, "users", user.uid), docData, {merge:true});
        console.log("here");
      })();
    }
  }, [user])

  if(loading) return<Loading/>;
  if(!user) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
