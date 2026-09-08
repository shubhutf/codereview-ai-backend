import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import ReportRouter from "./routes/Report.route.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL,  // your React dev server
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(clerkMiddleware());

app.set("strict routing", false)  
app.use("/api/Reports",requireAuth(),ReportRouter);
app.get("/", (req, res) => {
  res.send("Server is Live");
});



app.listen(port, () => {
  console.log(`App is listening to the port:${port}`);
  connectDB();
});