import express from 'express';
import authRoutes from "./routes/auth.route.js";
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json()); // allows us to parse incoming requests: req.body
app.use(cookieParser());

// Routes declaration
app.use("/api/auth", authRoutes)


export { app };