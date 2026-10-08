
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "VEXORA-AI backend is running."
    });
});

app.post("/api/chat", async (req, res) => {

    try {

        const { message, history = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        const cleanHistory = Array.isArray(history)
            ? history.slice(-12).map(item => ({
                role: item.role,
                content: item.content
            }))
            : [];

        const response = await client.responses.create({
            model: "gpt-6-luna",

            instructions: `
You are VEXORA-AI, a professional, intelligent and friendly AI assistant.

Your personality:
- Helpful
- Clear
- Professional
- Friendly
- Natural
- Confident

Rules:
- Answer the user's actual question.
- Give useful explanations.
- If the user asks for code, provide working code.
- If the user asks for something step-by-step, explain it step-by-step.
- If the user uses Roman Urdu, you may reply in Roman Urdu.
- If the user uses English, reply in English.
- Do not unnecessarily repeat the user's question.
- Keep simple questions concise.
- For complex questions, give structured answers.
`,

            input: [
                ...cleanHistory,
                {
                    role: "user",
                    content: message.trim()
                }
            ]
        });

        res.json({
            success: true,
            reply: response.output_text
        });

    } catch (error) {

        console.error("VEXORA ERROR:", error);

        res.status(500).json({
            success: false,
            error: "VEXORA-AI could not process your request."
        });
    }
});

app.listen(PORT, () => {
    console.log(`VEXORA-AI server running on http://localhost:${PORT}`);
});

