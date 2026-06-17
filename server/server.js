import express from 'express';
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())


app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
