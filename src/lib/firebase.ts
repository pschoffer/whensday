import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import config from "./config";

const firebaseConfig = {
    apiKey: "AIzaSyBU3nQ04DH26Xhs2BtCjLiuqxPc1VAZI-I",
    authDomain: "whensday-ca2ea.firebaseapp.com",
    projectId: "whensday-ca2ea",
    storageBucket: "whensday-ca2ea.firebasestorage.app",
    messagingSenderId: "154988040154",
    appId: "1:154988040154:web:951ade26ab74a687c37ae3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
if (config.useEmulators) {
    console.log('Using emulators')
    connectFirestoreEmulator(firestore, 'localhost', 8080);
}


export function toFirebaseDoc<Type>(obj: Type): any {
    const data: any = { ...obj };
    delete data.id;
    return data;
}

export function fromFirebaseDoc<Type>(doc: any): Type {
    const data = doc.data();

    const convertedData = convertData(data);
    if (convertedData) {
        convertedData.id = doc.id;
    }

    return convertedData;
}

export const convertData = (value: any): any => {
    if (!value) {
        return value;
    }

    if (typeof value !== 'object') {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(convertData);
    }

    if (value.toDate) {
        return value.toDate();
    }

    if (value._seconds) {
        return new Date(value._seconds * 1000);
    }

    const convertedData: any = {};
    for (const key of Object.keys(value)) {
        if (key.endsWith('At')) {
            convertedData[key] = new Date(convertData(value[key]));
        } else {
            convertedData[key] = convertData(value[key]);
        }
    }

    return convertedData;
}

export function fromFirebaseDocs<Type>(docs: Array<any>): Array<Type> {
    return docs.map(doc => fromFirebaseDoc<Type>(doc));
}