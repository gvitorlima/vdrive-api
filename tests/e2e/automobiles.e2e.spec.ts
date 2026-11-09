import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.ts";

describe("Módulo Automóveis (Automobiles)", () => {
  it("GET /api/automobiles - deve retornar lista vazia inicialmente no banco de teste", async () => {
    const res = await request(app).get("/api/automobiles");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Listagem realizada com sucesso",
      code: 200,
      content: [],
    });
  });

  it("POST /api/automobiles/create - deve criar automóvel com placa Mercosul (7 chars)", async () => {
    const res = await request(app)
      .post("/api/automobiles/create")
      .send({
        plate: "BRA2E19",
        color: "Azul Marinho",
        brand: "Hyundai",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Automóvel criado com sucesso");
    expect(res.body.content.id).toBeDefined();
    expect(res.body.content.plate).toBe("BRA2E19");
  });

  it("POST /api/automobiles/create - deve criar automóvel com placa tradicional (8 chars)", async () => {
    const res = await request(app)
      .post("/api/automobiles/create")
      .send({
        plate: "ABC-1234",
        color: "Prata",
        brand: "Toyota",
      });

    expect(res.status).toBe(201);
    expect(res.body.content.plate).toBe("ABC-1234");
  });

  it("POST /api/automobiles/create - deve rejeitar placa com menos de 7 caracteres", async () => {
    const res = await request(app)
      .post("/api/automobiles/create")
      .send({
        plate: "ABC1",
        color: "Prata",
        brand: "Toyota",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Payload inválido");
  });

  it("POST /api/automobiles/create - deve rejeitar placa com mais de 8 caracteres", async () => {
    const res = await request(app)
      .post("/api/automobiles/create")
      .send({
        plate: "ABC123456",
        color: "Prata",
        brand: "Toyota",
      });

    expect(res.status).toBe(400);
  });

  it("POST /api/automobiles/create - deve rejeitar dados obrigatórios ausentes", async () => {
    const res = await request(app)
      .post("/api/automobiles/create")
      .send({ plate: "BRA2E19" });

    expect(res.status).toBe(400);
  });

  it("GET /api/automobiles - deve filtrar por cor e marca", async () => {
    await request(app).post("/api/automobiles/create").send({
      plate: "ABC1234",
      color: "Prata",
      brand: "Toyota",
    });
    await request(app).post("/api/automobiles/create").send({
      plate: "XYZ9876",
      color: "Preto",
      brand: "Honda",
    });

    // Filtro por cor
    const filterColor = await request(app).get("/api/automobiles?color=prata");
    expect(filterColor.status).toBe(200);
    expect(filterColor.body.content).toHaveLength(1);
    expect(filterColor.body.content[0].cor).toBe("Prata");

    // Filtro por marca
    const filterBrand = await request(app).get("/api/automobiles?brand=honda");
    expect(filterBrand.status).toBe(200);
    expect(filterBrand.body.content).toHaveLength(1);
    expect(filterBrand.body.content[0].marca).toBe("Honda");

    // Filtro combinado
    const filterBoth = await request(app).get("/api/automobiles?color=prata&brand=toyota");
    expect(filterBoth.status).toBe(200);
    expect(filterBoth.body.content).toHaveLength(1);

    // Filtro sem correspondência
    const filterNone = await request(app).get("/api/automobiles?color=amarelo");
    expect(filterNone.status).toBe(200);
    expect(filterNone.body.content).toHaveLength(0);
  });

  it("GET /api/automobiles - deve retornar 400 ao passar parâmetro de busca inválido", async () => {
    const res = await request(app).get("/api/automobiles?color=");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Parâmetro de busca inválido");
  });

  it("GET /api/automobiles/:id - deve retornar os detalhes do veículo", async () => {
    const create = await request(app).post("/api/automobiles/create").send({
      plate: "ABC1234",
      color: "Prata",
      brand: "Toyota",
    });
    const autoId = create.body.content.id;

    const res = await request(app).get(`/api/automobiles/${autoId}`);
    expect(res.status).toBe(200);
    expect(res.body.content.id).toBe(autoId);
    expect(res.body.content.placa).toBe("ABC1234");
    expect(res.body.content.cor).toBe("Prata");
    expect(res.body.content.marca).toBe("Toyota");
    expect(res.body.content.inUse).toBe(false);
    expect(res.body.content.history).toEqual([]);
  });

  it("GET /api/automobiles/:id - deve retornar 404 para automóvel inexistente", async () => {
    const res = await request(app).get("/api/automobiles/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });

  it("PUT /api/automobiles/:id - deve atualizar placa, cor e marca", async () => {
    const create = await request(app).post("/api/automobiles/create").send({
      plate: "ABC1234",
      color: "Prata",
      brand: "Toyota",
    });
    const autoId = create.body.content.id;

    const res = await request(app).put(`/api/automobiles/${autoId}`).send({
      plate: "XYZ9999",
      color: "Cinza Metálico",
      brand: "Toyota Motors",
    });

    expect(res.status).toBe(200);
    expect(res.body.content.plate).toBe("XYZ9999");
    expect(res.body.content.color).toBe("Cinza Metálico");
    expect(res.body.content.brand).toBe("Toyota Motors");

    const getUpdated = await request(app).get(`/api/automobiles/${autoId}`);
    expect(getUpdated.body.content.placa).toBe("XYZ9999");
    expect(getUpdated.body.content.cor).toBe("Cinza Metálico");
  });

  it("PUT /api/automobiles/:id - deve retornar 400 ao atualizar com campos inválidos", async () => {
    const create = await request(app).post("/api/automobiles/create").send({
      plate: "ABC1234",
      color: "Prata",
      brand: "Toyota",
    });
    const autoId = create.body.content.id;

    const res = await request(app).put(`/api/automobiles/${autoId}`).send({
      plate: "CURTO",
      color: "P",
      brand: "",
    });

    expect(res.status).toBe(400);
  });

  it("PUT /api/automobiles/:id - deve retornar 404 ao atualizar veículo inexistente", async () => {
    const res = await request(app).put("/api/automobiles/00000000-0000-0000-0000-000000000000").send({
      plate: "ABC1234",
      color: "Prata",
      brand: "Toyota",
    });

    expect(res.status).toBe(404);
  });

  it("DELETE /api/automobiles/:id - deve excluir automóvel que não está em uso (retorna 204)", async () => {
    const create = await request(app).post("/api/automobiles/create").send({
      plate: "ABC1234",
      color: "Prata",
      brand: "Toyota",
    });
    const autoId = create.body.content.id;

    const deleteRes = await request(app).delete(`/api/automobiles/${autoId}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/automobiles/${autoId}`);
    expect(getRes.status).toBe(404);
  });

  it("DELETE /api/automobiles/:id - deve retornar 404 ao excluir veículo inexistente", async () => {
    const res = await request(app).delete("/api/automobiles/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });
});
