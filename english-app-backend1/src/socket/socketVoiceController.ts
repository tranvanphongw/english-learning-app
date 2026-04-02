import fs from "fs";
import path from "path";
import axios from "axios";
import { execSync } from "child_process";
import { Server, Socket } from "socket.io";
import { ConversationHistory } from "../models/ConversationHistory";

const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export function initVoiceSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🟢 Voice socket connected:", socket.id);

    /* ----------- PHIÊN BẢN GỬI FILE ĐƠN LẺ (Flutter hiện tại) ----------- */
    socket.on("voice_message", async (data) => {
      try {
        const { userId, audioBase64 } = data;
        if (!audioBase64) return;

        const tempPath = path.join(uploadDir, `${Date.now()}-input.wav`);
        fs.writeFileSync(tempPath, Buffer.from(audioBase64, "base64"));
        console.log(`🎙️ Received audio from ${userId}`);

        const form = new (require("form-data"))();
        form.append("file", fs.createReadStream(tempPath));
        form.append("model", "whisper-1");

        const whisperResp = await axios.post(
          "https://api.openai.com/v1/audio/transcriptions",
          form,
          { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, ...form.getHeaders() } }
        );

        const transcript = whisperResp.data.text?.trim() || "";
        console.log(`🗣️ Transcript: ${transcript}`);

        const gptResp = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a friendly English teacher. Keep your responses short, natural, and encouraging.",
              },
              { role: "user", content: transcript },
            ],
          },
          { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        const aiResponse = gptResp.data.choices[0].message.content.trim();
        console.log(`🤖 AI: ${aiResponse}`);

        const ttsResp = await axios.post(
          "https://api.openai.com/v1/audio/speech",
          { model: "gpt-4o-mini-tts", voice: "alloy", input: aiResponse },
          {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            responseType: "arraybuffer",
          }
        );

        const outPath = path.join(uploadDir, `${Date.now()}-reply.mp3`);
        fs.writeFileSync(outPath, Buffer.from(ttsResp.data));
        // Use mobile app's IP instead of localhost
        const audioUrl = `${process.env.BASE_URL || "http://172.16.16.97:4000"}/uploads/${path.basename(outPath)}`;
        console.log(`🔊 Generated audio URL: ${audioUrl}`);

        if (userId) {
          await ConversationHistory.create({ userId, transcript, aiResponse, audioUrl });
        }

        socket.emit("ai_reply", { transcript, aiResponse, audioUrl });
        fs.unlink(tempPath, () => {});
      } catch (err: any) {
        console.error("🔥 Voice socket error:", err?.response?.status, err?.response?.data || err.message);
        
        // 🎭 DEMO MODE - Fallback responses khi API quota hết
        const demoResponses = [
          { text: "Hello! I'm your AI English tutor. How can I help you practice today?", audioPath: "demo1.mp3" },
          { text: "Great! Let's practice some English conversation together.", audioPath: "demo2.mp3" },
          { text: "That's interesting! Can you tell me more about that?", audioPath: "demo3.mp3" },
          { text: "Excellent pronunciation! Keep up the good work.", audioPath: "demo4.mp3" },
          { text: "I understand. Let's try a different approach to learning English.", audioPath: "demo5.mp3" }
        ];
        
        const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        
        socket.emit("ai_reply", {
          transcript: "Demo mode - API quota exceeded",
          aiResponse: randomResponse.text,
          audioUrl: `${process.env.BASE_URL || "http://172.16.1.71:4000"}/uploads/${randomResponse.audioPath}`
        });
      }
    });

    /* ---------------------- PHIÊN BẢN STREAM (giữ lại nhẹ) ---------------------- */
    let chunks: Buffer[] = [];
    let currentUserId: string | null = null;

    socket.on("voice_start", (data) => {
      currentUserId = data.userId;
      chunks = [];
      console.log(`🎤 [Realtime] User ${currentUserId} started talking`);
    });

    socket.on("voice_chunk", (data) => {
      if (!data?.chunk) return;
      chunks.push(Buffer.from(data.chunk, "base64"));
    });

    socket.on("voice_end", async () => {
      console.log(`🛑 [Realtime] Voice stream ended`);
      const rawPath = path.join(uploadDir, `${Date.now()}-stream.raw`);
      const wavPath = path.join(uploadDir, `${Date.now()}-stream.wav`);
      fs.writeFileSync(rawPath, Buffer.concat(chunks));

      try {
        // 🔄 Convert raw audio → WAV container
        execSync(`ffmpeg -f s16le -ar 16000 -ac 1 -i ${rawPath} ${wavPath}`);

        const form = new (require("form-data"))();
        form.append("file", fs.createReadStream(wavPath));
        form.append("model", "whisper-1");

        const whisper = await axios.post(
          "https://api.openai.com/v1/audio/transcriptions",
          form,
          { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, ...form.getHeaders() } }
        );

        const transcript = whisper.data.text?.trim() || "";
        console.log("🗣️ [Realtime] Transcript:", transcript);

        const gpt = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a friendly English tutor. Keep it short and natural." },
              { role: "user", content: transcript },
            ],
          },
          { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        const aiResponse = gpt.data.choices[0].message.content.trim();
        console.log("🤖 [Realtime] AI:", aiResponse);

        const tts = await axios.post(
          "https://api.openai.com/v1/audio/speech",
          { model: "gpt-4o-mini-tts", voice: "alloy", input: aiResponse },
          {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            responseType: "arraybuffer",
          }
        );

        const outPath = path.join(uploadDir, `${Date.now()}-reply.mp3`);
        fs.writeFileSync(outPath, Buffer.from(tts.data));
        // Use mobile app's IP instead of localhost
        const audioUrl = `${process.env.BASE_URL || "http://172.16.1.71:4000"}/uploads/${path.basename(outPath)}`;
        console.log(`🔊 [Realtime] Generated audio URL: ${audioUrl}`);

        if (currentUserId) {
          await ConversationHistory.create({ userId: currentUserId, transcript, aiResponse, audioUrl });
        }

        socket.emit("ai_reply", { transcript, aiResponse, audioUrl });

        fs.unlink(rawPath, () => {});
        fs.unlink(wavPath, () => {});
      } catch (err: any) {
        console.error("🔥 [Realtime] Voice socket error:", err?.response?.status, err?.response?.data || err.message);
        socket.emit("ai_reply", {
          transcript: "(error)",
          aiResponse: "Sorry, I couldn’t process your voice right now.",
        });
      }
    });

    socket.on("disconnect", () => console.log("🔴 Voice socket disconnected:", socket.id));
  });
}
