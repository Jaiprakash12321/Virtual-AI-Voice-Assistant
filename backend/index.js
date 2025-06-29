import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"


const app=express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const port=process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.post("/api/ai", async (req, res) => {
  try {
    const { prompt, assistantName, userName } = req.body;
    
    if (!prompt || !assistantName || !userName) {
      return res.status(400).json({ message: "Prompt, assistantName, and userName are required" });
    }
    const aiResponse = await geminiResponse(prompt, assistantName, userName);
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ message: "Failed to get AI response" });
  }
});



app.listen(port,()=>{
    connectDb()
    console.log("server started")
})

