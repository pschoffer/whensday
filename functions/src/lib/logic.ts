
import * as admin from 'firebase-admin';
import { User } from '../models/User';
import { logger } from 'firebase-functions';
import { sendWeCouldntUnderstandSMS, sendWeNeedYourHelpSMS, WE_NEED_YOUR_HELP_SMS } from './46elks';
import { evaluateReply } from './ai';
import { LogItem } from '../models/LogItem';


export const processReply = async (number: string, message: string) => {
    const findUserSnap = await admin.firestore().collection("users").where("phone", "==", number).get();
    if (findUserSnap.empty) {
        logger.info("User not found", { number });
        return;
    }
    const user = fromFirebaseDoc<User>(findUserSnap.docs[0]);


    const reply = await evaluateReply(WE_NEED_YOUR_HELP_SMS, message);
    console.log("AI reply", { reply });

    const newLog: Partial<LogItem> = {
        message: `<- ${user.name}: ${message} <result: ${reply.yes}, score: ${reply.score}>`,
    }
    await admin.firestore().collection("logs").add(newLog);

    if (reply.score < 50) {
        logger.info("We are not sure what the user means", { message });
        await sendWeCouldntUnderstandSMS(user);
        return;
    }

    const userUpdate: Partial<User> = {
        working: reply.yes || false,
    }
    await admin.firestore().collection("users").doc(user.id).update(userUpdate);
};

export const ensureEnoughStaff = async () => {
    const configSnap = await admin.firestore().collection("config").doc("public").get();
    const requiredStaffCount = configSnap.data()?.requiredStaffCount || 0;
    logger.info("Ensuring enough staff", { requiredStaffCount });

    const allStaffSnap = await admin.firestore().collection("users").get();
    const allStaff = fromFirebaseDocs<User>(allStaffSnap.docs);

    const workingStaff = allStaff.filter(user => user.working);
    const workingStaffCount = workingStaff.length;
    logger.info("Working staff count", { workingStaffCount });

    if (workingStaffCount >= requiredStaffCount) {
        logger.info("Enough staff available", { workingStaffCount });
        return;
    }
    const nonWorkingStaff = allStaff.filter(user => !user.working);

    for (const staff of nonWorkingStaff) {
        await sendWeNeedYourHelpSMS(staff);
    }
}

export const ensureUserExists = async (phone: string): Promise<User> => {
    const userSnap = await admin.firestore().collection("users").where("phone", "==", phone).get();
    if (!userSnap.empty) {
        return userSnap.docs[0].data() as User;
    }

    const color = getRandomColor();
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const name = `${capitalize(color)} ${getRandomName()}`;
    const newUser: Partial<User> = {
        name,
        phone: phone,
        color,
        working: false,
    };
    const userRef = await admin.firestore().collection("users").add(newUser);
    newUser.id = userRef.id;

    return newUser as User;
}

const COLORS = [
    'red',
    'green',
    'blue',
    'yellow',
    'purple',
    'orange',
    'pink',
    'brown',
    'gray',
]
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const NAMES = [
    'Falcon',
    'Eagle',
    'Hawk',
    'Raptor',
    'Hornet',
    'Viper',
    'Lightning',
    'Thunderbolt',
    'Tomcat',
    'Warthog',
    'Blackbird',
    'Harrier',
    'Phantom',
    'Corsair',
    'Skyhawk',
    'Intruder',
    'Superfortress',
    'Stratofortress',
    'Globemaster',
    'Galaxy',
    'Grippen',
]
const getRandomName = () => NAMES[Math.floor(Math.random() * NAMES.length)];

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


export const cleanNumber = (input: string) => {
    let number = input;
    if (!input.startsWith("+")) {
        number = "+46" + input;
    }

    number = number.replace(/\s+/g, '').replace(/-/g, '');
    return number;
}

export const isValidNumber = (number: string) => {
    number = number.replace(/\s+/g, '').replace(/-/g, '');
    const regex = /^[+]?\d+$/;
    return regex.test(number);
}
