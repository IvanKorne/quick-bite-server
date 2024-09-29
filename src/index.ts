import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute";

mongoose
  .connect(process.env.MONGO_DB!)
  .then(() => console.log("connected to db"));

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3010;

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health!" });
});
app.use("/api/my/user", myUserRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
