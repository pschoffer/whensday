/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { sendWelcomeSMS } from "./lib/46elks";
import { logger, setGlobalOptions } from "firebase-functions";
import * as admin from 'firebase-admin';
import { cleanNumber, ensureEnoughStaff, ensureUserExists, isValidNumber, processReply } from "./lib/logic";
import { onDocumentWritten } from "firebase-functions/firestore";

admin.initializeApp();

const region = 'europe-west1';

setGlobalOptions({ region });


export const registerNewNumber = onRequest({ cors: true }, async (request, response) => {
    const number = request.query.number || request.body.number;
    if (!number) {
        response.send("No number provided");
        return;
    }
    if (!isValidNumber(number)) {
        response.send("Invalid number");
        return;
    }

    try {
        const cleanedNumber = cleanNumber(number);
        const user = await ensureUserExists(cleanedNumber);
        await sendWelcomeSMS(user)

        response.send("ok");
    } catch (error) {
        console.error("Error sending SMS", error);
        response.status(500).send("Error sending SMS");
    }
});

export const onReply = onRequest({ cors: true }, async (request, response) => {
    const { from, to, message } = request.body;
    logger.info("Received reply", { from, to, reply: message });

    try {
        await processReply(from, message);
    } catch (error) {
        console.error("Error processing reply", error);
    }

    response.send("ok");
});

export const onConfigUpdate = onDocumentWritten('config/public', () => ensureEnoughStaff());
export const onUserWrite = onDocumentWritten('users/{userId}', () => ensureEnoughStaff());
