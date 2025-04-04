import { logger } from "firebase-functions"
import axios from "axios"
import { PASS_46ELKS, USERNAME_46ELKS } from "./secrets";

export const sendWelcomeSMS = async (originalNumber: string) => {
    let number = originalNumber;
    if (!originalNumber.startsWith("+")) {
        number = "+46" + originalNumber;
    }


    logger.info("Sending welcome SMS to", { number });


    const dataObject = {
        from: "ElksWelcome",
        to: number,
        message: "Highway to hell"
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
    logger.info("SMS sent to", { number });
}
