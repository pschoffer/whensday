import { logger } from "firebase-functions"
import axios from "axios"
import { PASS_46ELKS, USERNAME_46ELKS } from "./secrets";
import { User } from "../models/User";


const WELCOME_SMS = "Welcome to Whensday! Your call sign is {name}.";
const WE_NEED_YOUR_HELP_SMS = "PANIC! We need your help {name}, can you work now?";

export const sendWeNeedYourHelpSMS = async (user: User) => {
    logger.info("Sending we need your help SMS to", { user });
    const message = WE_NEED_YOUR_HELP_SMS.replace("{name}", user.name);
    return sendSMS(user, message);
}

export const sendWelcomeSMS = async (user: User) => {
    logger.info("Sending welcome SMS to", { user });
    const message = WELCOME_SMS.replace("{name}", user.name),

    return sendSMS(user, message);
}


export const sendSMS = async (user: User, message: string) => {
    const dataObject = {
        from: "Whensday",
        to: user.phone,
        message,
    }

    const data = new URLSearchParams(dataObject);

    await axios.post("https://api.46elks.com/a1/sms",
        data.toString(),
        {
            auth: {
                username: USERNAME_46ELKS,
                password: PASS_46ELKS,
            },
        })
    logger.info("SMS sent to", { user });
}
