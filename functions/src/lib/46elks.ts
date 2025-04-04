import { logger } from "firebase-functions"
import axios from "axios"
import { PASS_46ELKS, USERNAME_46ELKS } from "./secrets";
import { User } from "../models/User";

export const sendWelcomeSMS = async (user: User) => {
    logger.info("Sending welcome SMS to", { user });

    const dataObject = {
        from: "Whensday",
        to: user.phone,
        message: "Welcome to Whensday! Your call sign is " + user.name + ".",
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
