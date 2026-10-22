import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  // Use environment variables if possible, but for a debug script
  // I might need to hardcode or use the ones from process.env if available.
  // Actually, I can probably just assume the environment is set up.
};

// Since I don't have the config here easily, I'll try to just load it from the file directly.
import config from '../src/lib/firebase-applet-config.json';

const app = initializeApp(config);
const db = getFirestore(app, 'ai-studio-arcbesarchitectu-e848cfe6-483d-46f7-8ddc-25160dc1e05c');

async function debug() {
  const docRef = doc(db, 'cms_content', 'main');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("CMS Data:", JSON.stringify(docSnap.data(), null, 2));
  } else {
    console.log("No such document!");
  }
}

debug();
