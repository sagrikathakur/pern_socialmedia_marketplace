import express from 'express';
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import listingRouter from "./routes/listingRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Mount routers
app.use("/api/listings", listingRouter);
app.use("/api/chats", chatRouter);

// Mount Inngest Express middleware//
app.get("/", (req, res) => {
  res.send("Hello World");
})
app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

