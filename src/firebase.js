import firebase from 'firebase'

const firebaseApp =firebase.initializeApp( {
    apiKey: "AIzaSyA0PA5WuzSYWM3KxIAIULkqveiaG6_aD8M",
    authDomain: "instagram-910e2.firebaseapp.com",
    databaseURL: "https://instagram-910e2.firebaseio.com",
    projectId: "instagram-910e2",
    storageBucket: "instagram-910e2.appspot.com",
    messagingSenderId: "1044803520202",
    appId: "1:1044803520202:web:c6b0074556e39daf035633",
    measurementId: "G-SGW4CBYYWX"
  });

  const db=firebaseApp.firestore()
  const auth=firebase.auth()
  const storage=firebase.storage()

  export {db,auth,storage}