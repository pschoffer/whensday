import Client from "opperai";
import { OPPER_API_KEY } from "./secrets";
import { logger } from "firebase-functions";

export const evaluatePicture = async (pictureUrl: string): Promise<PictureReply> => {
    const client = new Client({ apiKey: OPPER_API_KEY });

    const response = await client.call({
        name: "describe_image",
        instructions: "How many people are in the picture?",
        input: pictureUrl,
        output_schema: {
            properties: {
                numberPeople: {
                    type: "number",
                    description: "Number of people in the picture.",
                },
            },
        },
    })
    logger.info("AI response", { response });

    const reply = (response.json_payload as any) as PictureReply;
    return reply;
}

interface PictureReply {
    numberPeople: number;
}


export const evaluateReply = async (question: string, answer: string): Promise<Reply> => {
    const client = new Client({ apiKey: OPPER_API_KEY });

    const prompt = `Evaluate response to question "${question}"
     and return if their answer is yes or not and a score from 0 to 100 of how certain are you. 
    The answer is "${answer}".
     `;

    const response = await client.call({
        input: prompt,
        name: "evaluate",
        output_schema: {
            properties: {
                yes: {
                    type: "boolean",
                    description: "Is the answer affirming?",
                },
                score: {
                    type: "number",
                    description: "Score from 0 to 100 of how certain are you.",
                },
            },
        },
    })

    logger.info("AI response", { response });

    const reply = (response.json_payload as any) as Reply;
    return reply;
}

interface Reply {
    yes: boolean;
    score: number;
}
