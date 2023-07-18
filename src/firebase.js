import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'



export const firebaseApp = initializeApp({
    apiKey: "AIzaSyAs1fs9uYPu483Hn8ErMK4e52z1akC4mck",
    authDomain: "test1-8f077.firebaseapp.com",
    databaseURL: "https://test1-8f077-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "test1-8f077",
    storageBucket: "test1-8f077.appspot.com",
    messagingSenderId: "145770969403",
    appId: "1:145770969403:web:41dc4add13b9411d599f1e",
    measurementId: "G-918D3N6JPF"
})

export const auth = getAuth()
export const db = getDatabase(firebaseApp)
// export function users(uid) {
//  return useDatabaseObject(dbRef(db, 'uids/' + uid))
// }


