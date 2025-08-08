import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
dotenv.config();
const app = express();
app.use(
  cors({
    credentials: true,
    orgin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

connectDB()
const PORT = 8080 || process.env.PORT;

app.get("/", (req, res) => {
  res.send(
    "<h2 style='text-align:center'>API is working! No need to visit here. :)</h2>"
  );
});
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
