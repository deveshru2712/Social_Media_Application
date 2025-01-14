import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import connectToDb from "./Db/Db.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  connectToDb();
  console.log(`server is running on the port :${port}`);
});
