import express, { type Express, type Request, type Response } from "express";
import { env } from "./modules/config.ts";

const app: Express = express();
const port = env.PORT;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
