import { AppConstants } from "@/constants/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: AppConstants.firebase.apiKey,
    authDomain: AppConstants.firebase.authDomain,
    projectId: AppConstants.firebase.projectId,
    storageBucket: AppConstants.firebase.storageBucket,
    messagingSenderId: AppConstants.firebase.messagingSenderId,
    appId: AppConstants.firebase.appId,
};

const app = initializeApp(firebaseConfig);

export default app;

export const auth = getAuth(app);
