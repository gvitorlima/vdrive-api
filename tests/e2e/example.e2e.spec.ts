import { readFileSync } from "node:fs";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.ts";

describe("Test Database & Initial Setup", () => {
  it("deve iniciar com a lista de automóveis vazia", async () => {
    const response = await request(app).get("/api/automobiles");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Listagem realizada com sucesso",
      code: 200,
      content: [],
    });
  });

  it("deve iniciar com a lista de motoristas vazia", async () => {
    const response = await request(app).get("/api/drivers");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Listagem realizada com sucesso",
      code: 200,
      content: [],
    });
  });

  it("deve iniciar com a lista de utilizações vazia", async () => {
    const response = await request(app).get("/api/usages");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Listagem realizada com sucesso",
      code: 200,
      content: [],
    });
  });

  it("deve persistir no banco de testes (tests/database) e não no banco principal", async () => {
    const mainAutomobilesBefore = readFileSync(
      path.resolve(process.cwd(), "database/automobiles.json"),
      "utf-8",
    );

    const createResponse = await request(app)
      .post("/api/automobiles/create")
      .send({
        plate: "TEST123",
        color: "Azul",
        brand: "Fiat",
      });

    expect(createResponse.status).toBe(201);

    // Verifica que gravou no tests/database/automobiles.json
    const testDbAutomobiles = JSON.parse(
      readFileSync(
        path.resolve(process.cwd(), "tests/database/automobiles.json"),
        "utf-8",
      ),
    );
    expect(testDbAutomobiles).toHaveLength(1);
    expect(testDbAutomobiles[0].placa).toBe("TEST123");

    // Verifica que o banco principal permaneceu inalterado
    const mainAutomobilesAfter = readFileSync(
      path.resolve(process.cwd(), "database/automobiles.json"),
      "utf-8",
    );
    expect(mainAutomobilesAfter).toBe(mainAutomobilesBefore);
  });

  it("deve voltar a ficar vazio no próximo teste graças ao reset automático", async () => {
    const response = await request(app).get("/api/automobiles");

    expect(response.status).toBe(200);
    expect(response.body.content).toEqual([]);
  });
});
