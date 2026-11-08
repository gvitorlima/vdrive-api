import express, { type Express, type Request, type Response } from "express";
import apiRouter from "./modules/routes.ts";
import { env } from "./modules/config.ts";

const app: Express = express();

/**
 * Monta toda a API a partir de um único ponto
 * usando como prefixo /api
 */
app.use("/api", apiRouter);

const port = env.PORT;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
