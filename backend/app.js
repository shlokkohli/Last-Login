import express from 'express';
import authRoutes from "./routes/auth.route.js";
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();

app.use(express.json()); // allows us to parse incoming requests: req.body
app.use(cookieParser());
app.use(cors({origin: "http://localhost:5173", credentials: true})); // this allows our backend to give data to our frontend

// Routes declaration
app.use("/api/auth", authRoutes)


export { app };