import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Checking SDK...");
const genAI = new GoogleGenerativeAI("DUMMY_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  try {
    const chat = model.startChat({
      history: [],
      systemInstruction: { role: "system", parts: [{ text: "You are an AI coach." }] }
    });
    console.log("startChat succeeded, sending message...");
    await chat.sendMessage("hello");
  } catch (e) {
    console.log("Error:", e.message);
  }
}
run();
