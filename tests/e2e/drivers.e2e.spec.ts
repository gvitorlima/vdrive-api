import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.ts";

describe("Módulo Motoristas (Drivers)", () => {
  it("GET /api/drivers - deve retornar lista vazia inicialmente no banco de teste", async () => {
    const res = await request(app).get("/api/drivers");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Listagem realizada com sucesso",
      code: 200,
      content: [],
    });
  });

  it("POST /api/drivers/create - deve criar um motorista válido com sucesso", async () => {
    const res = await request(app)
      .post("/api/drivers/create")
      .send({ name: "Carlos Eduardo Silva" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Motorista criado com sucesso");
    expect(res.body.code).toBe(201);
    expect(res.body.content.id).toBeDefined();
    expect(res.body.content.name).toBe("Carlos Eduardo Silva");
  });

  it("POST /api/drivers/create - deve rejeitar criação com nome menor que 8 caracteres", async () => {
    const res = await request(app)
      .post("/api/drivers/create")
      .send({ name: "Lucas" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Payload inválido");
    expect(res.body.code).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("POST /api/drivers/create - deve rejeitar criação sem payload ou sem nome", async () => {
    const res = await request(app)
      .post("/api/drivers/create")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.code).toBe(400);
  });

  it("GET /api/drivers - deve listar motoristas cadastrados e filtrar por nome", async () => {
    await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    await request(app).post("/api/drivers/create").send({ name: "Ana Carolina Souza" });

    const listAll = await request(app).get("/api/drivers");
    expect(listAll.status).toBe(200);
    expect(listAll.body.content).toHaveLength(2);

    const filterCarlos = await request(app).get("/api/drivers?name=carlos");
    expect(filterCarlos.status).toBe(200);
    expect(filterCarlos.body.content).toHaveLength(1);
    expect(filterCarlos.body.content[0].nome).toBe("Carlos Eduardo Silva");

    const filterNone = await request(app).get("/api/drivers?name=Inexistente");
    expect(filterNone.status).toBe(200);
    expect(filterNone.body.content).toEqual([]);
  });

  it("GET /api/drivers - deve retornar 400 ao passar parâmetro de busca inválido", async () => {
    const res = await request(app).get("/api/drivers?name=");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Parâmetro de busca inválido");
  });

  it("GET /api/drivers/:id - deve buscar motorista por ID", async () => {
    const create = await request(app)
      .post("/api/drivers/create")
      .send({ name: "Roberto Alves Pereira" });
    const driverId = create.body.content.id;

    const res = await request(app).get(`/api/drivers/${driverId}`);
    expect(res.status).toBe(200);
    expect(res.body.content.id).toBe(driverId);
    expect(res.body.content.nome).toBe("Roberto Alves Pereira");
    expect(res.body.content.inUse).toBe(false);
    expect(res.body.content.history).toEqual([]);
  });

  it("GET /api/drivers/:id - deve retornar 404 para motorista inexistente", async () => {
    const res = await request(app).get("/api/drivers/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
    expect(res.body.code).toBe(404);
    expect(res.body.message).toContain("not found");
  });

  it("PUT /api/drivers/:id - deve atualizar o nome de um motorista existente", async () => {
    const create = await request(app)
      .post("/api/drivers/create")
      .send({ name: "Juliana Martins Santos" });
    const driverId = create.body.content.id;

    const res = await request(app)
      .put(`/api/drivers/${driverId}`)
      .send({ name: "Juliana Martins Santos Atualizada" });

    expect(res.status).toBe(200);
    expect(res.body.content.name).toBe("Juliana Martins Santos Atualizada");

    const getUpdated = await request(app).get(`/api/drivers/${driverId}`);
    expect(getUpdated.body.content.nome).toBe("Juliana Martins Santos Atualizada");
  });

  it("PUT /api/drivers/:id - deve retornar 400 ao tentar atualizar com nome menor que 8 caracteres", async () => {
    const create = await request(app)
      .post("/api/drivers/create")
      .send({ name: "Pedro Henrique Rocha" });
    const driverId = create.body.content.id;

    const res = await request(app)
      .put(`/api/drivers/${driverId}`)
      .send({ name: "Pedro" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Payload inválido");
  });

  it("PUT /api/drivers/:id - deve retornar 404 ao atualizar motorista inexistente", async () => {
    const res = await request(app)
      .put("/api/drivers/00000000-0000-0000-0000-000000000000")
      .send({ name: "Nome Valido Inexistente" });

    expect(res.status).toBe(404);
  });

  it("DELETE /api/drivers/:id - deve excluir motorista que não está em uso (retorna 204)", async () => {
    const create = await request(app)
      .post("/api/drivers/create")
      .send({ name: "Camila Mendes Gomes" });
    const driverId = create.body.content.id;

    const deleteRes = await request(app).delete(`/api/drivers/${driverId}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/drivers/${driverId}`);
    expect(getRes.status).toBe(404);
  });

  it("DELETE /api/drivers/:id - deve retornar 404 ao tentar excluir motorista inexistente", async () => {
    const res = await request(app).delete("/api/drivers/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });
});
