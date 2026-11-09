import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.ts";

describe("Módulo Utilizações (Usages) & Regras de Negócio", () => {
  it("GET /api/usages - deve listar utilizações vazias inicialmente no banco de teste", async () => {
    const res = await request(app).get("/api/usages");
    expect(res.status).toBe(200);
    expect(res.body.content).toEqual([]);
  });

  it("POST /api/usages/create - deve iniciar uma utilização válida com sucesso", async () => {
    // Cria motorista e automóvel
    const driverRes = await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    const autoRes = await request(app).post("/api/automobiles/create").send({
      plate: "BRA2E19",
      color: "Azul Marinho",
      brand: "Hyundai",
    });

    const driverId = driverRes.body.content.id;
    const autoId = autoRes.body.content.id;

    const res = await request(app).post("/api/usages/create").send({
      driverId,
      automobileId: autoId,
      reason: "Viagem técnica para filial centro",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Utilização criada com sucesso");
    expect(res.body.content.id).toBeDefined();
    expect(res.body.content.startDate).toBeDefined();
    expect(res.body.content.endDate).toBeNull();
    expect(res.body.content.reason).toBe("Viagem técnica para filial centro");

    // Valida que motorista e automóvel agora estão em uso
    const checkDriver = await request(app).get(`/api/drivers/${driverId}`);
    expect(checkDriver.body.content.inUse).toBe(true);

    const checkAuto = await request(app).get(`/api/automobiles/${autoId}`);
    expect(checkAuto.body.content.inUse).toBe(true);
  });

  it("POST /api/usages/create [Regra R2] - deve bloquear motorista que já está em uso ativo (409)", async () => {
    const driverRes = await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    const auto1Res = await request(app).post("/api/automobiles/create").send({ plate: "BRA2E19", color: "Azul", brand: "Hyundai" });
    const auto2Res = await request(app).post("/api/automobiles/create").send({ plate: "XYZ9876", color: "Preto", brand: "Honda" });

    const driverId = driverRes.body.content.id;
    const auto1Id = auto1Res.body.content.id;
    const auto2Id = auto2Res.body.content.id;

    // Inicia primeiro uso
    await request(app).post("/api/usages/create").send({
      driverId,
      automobileId: auto1Id,
      reason: "Primeira utilização ativa",
    });

    // Tentativa de segundo uso simultâneo com o mesmo motorista
    const res = await request(app).post("/api/usages/create").send({
      driverId,
      automobileId: auto2Id,
      reason: "Segunda utilização simultânea",
    });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe(409);
    expect(res.body.message).toContain("is already using an automobile");
  });

  it("POST /api/usages/create [Regra R3] - deve bloquear automóvel que já está em uso ativo (409)", async () => {
    const driver1Res = await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    const driver2Res = await request(app).post("/api/drivers/create").send({ name: "Ana Carolina Souza" });
    const autoRes = await request(app).post("/api/automobiles/create").send({ plate: "BRA2E19", color: "Azul", brand: "Hyundai" });

    const driver1Id = driver1Res.body.content.id;
    const driver2Id = driver2Res.body.content.id;
    const autoId = autoRes.body.content.id;

    // Inicia primeiro uso com motorista 1
    await request(app).post("/api/usages/create").send({
      driverId: driver1Id,
      automobileId: autoId,
      reason: "Primeira utilização com carro",
    });

    // Tentativa do motorista 2 de pegar o mesmo carro
    const res = await request(app).post("/api/usages/create").send({
      driverId: driver2Id,
      automobileId: autoId,
      reason: "Tentativa de uso duplo do automóvel",
    });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe(409);
    expect(res.body.message).toContain("is already in use");
  });

  it("DELETE /api/drivers/:id & DELETE /api/automobiles/:id - deve bloquear exclusão de recursos em uso (409)", async () => {
    const driverRes = await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    const autoRes = await request(app).post("/api/automobiles/create").send({ plate: "BRA2E19", color: "Azul", brand: "Hyundai" });

    const driverId = driverRes.body.content.id;
    const autoId = autoRes.body.content.id;

    await request(app).post("/api/usages/create").send({
      driverId,
      automobileId: autoId,
      reason: "Utilização em andamento",
    });

    // Tentar deletar motorista em uso
    const deleteDriverRes = await request(app).delete(`/api/drivers/${driverId}`);
    expect(deleteDriverRes.status).toBe(409);
    expect(deleteDriverRes.body.message).toContain("because it is currently in use");

    // Tentar deletar automóvel em uso
    const deleteAutoRes = await request(app).delete(`/api/automobiles/${autoId}`);
    expect(deleteAutoRes.status).toBe(409);
    expect(deleteAutoRes.body.message).toContain("because it is currently in use");
  });

  it("POST /api/usages/create - deve retornar 404 para motorista ou automóvel inexistente", async () => {
    const autoRes = await request(app).post("/api/automobiles/create").send({ plate: "BRA2E19", color: "Azul", brand: "Hyundai" });
    const autoId = autoRes.body.content.id;

    const resDriverNotFound = await request(app).post("/api/usages/create").send({
      driverId: "00000000-0000-0000-0000-000000000000",
      automobileId: autoId,
      reason: "Motivo qualquer válido",
    });
    expect(resDriverNotFound.status).toBe(404);

    const driverRes = await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    const driverId = driverRes.body.content.id;

    const resAutoNotFound = await request(app).post("/api/usages/create").send({
      driverId,
      automobileId: "00000000-0000-0000-0000-000000000000",
      reason: "Motivo qualquer válido",
    });
    expect(resAutoNotFound.status).toBe(404);
  });

  it("POST /api/usages/create - deve retornar 400 para motivo menor que 5 caracteres", async () => {
    const driverRes = await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    const autoRes = await request(app).post("/api/automobiles/create").send({ plate: "BRA2E19", color: "Azul", brand: "Hyundai" });

    const res = await request(app).post("/api/usages/create").send({
      driverId: driverRes.body.content.id,
      automobileId: autoRes.body.content.id,
      reason: "Oi",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Payload inválido");
  });

  it("PATCH /api/usages/:id/finish - deve finalizar a utilização e liberar motorista e automóvel", async () => {
    const driverRes = await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    const autoRes = await request(app).post("/api/automobiles/create").send({ plate: "BRA2E19", color: "Azul", brand: "Hyundai" });

    const driverId = driverRes.body.content.id;
    const autoId = autoRes.body.content.id;

    const usageRes = await request(app).post("/api/usages/create").send({
      driverId,
      automobileId: autoId,
      reason: "Entrega de documentos fiscais",
    });
    const usageId = usageRes.body.content.id;

    // Finaliza uso
    const finishRes = await request(app).patch(`/api/usages/${usageId}/finish`);
    expect(finishRes.status).toBe(200);
    expect(finishRes.body.message).toBe("Utilização finalizada com sucesso");
    expect(finishRes.body.content.endDate).toBeDefined();
    expect(finishRes.body.content.endDate).not.toBeNull();

    // Valida que motorista e carro voltaram a estar livres (inUse: false)
    const checkDriver = await request(app).get(`/api/drivers/${driverId}`);
    expect(checkDriver.body.content.inUse).toBe(false);
    expect(checkDriver.body.content.history).toHaveLength(1);

    const checkAuto = await request(app).get(`/api/automobiles/${autoId}`);
    expect(checkAuto.body.content.inUse).toBe(false);
    expect(checkAuto.body.content.history).toHaveLength(1);

    // Agora deve permitir exclusão dos dois
    const deleteDriverRes = await request(app).delete(`/api/drivers/${driverId}`);
    expect(deleteDriverRes.status).toBe(204);

    const deleteAutoRes = await request(app).delete(`/api/automobiles/${autoId}`);
    expect(deleteAutoRes.status).toBe(204);
  });

  it("PATCH /api/usages/:id/finish - deve retornar 400 ao tentar finalizar utilização já finalizada", async () => {
    const driverRes = await request(app).post("/api/drivers/create").send({ name: "Carlos Eduardo Silva" });
    const autoRes = await request(app).post("/api/automobiles/create").send({ plate: "BRA2E19", color: "Azul", brand: "Hyundai" });

    const usageRes = await request(app).post("/api/usages/create").send({
      driverId: driverRes.body.content.id,
      automobileId: autoRes.body.content.id,
      reason: "Uso breve",
    });
    const usageId = usageRes.body.content.id;

    // Primeira finalização -> OK
    await request(app).patch(`/api/usages/${usageId}/finish`);

    // Segunda finalização -> 400 Bad Request
    const res = await request(app).patch(`/api/usages/${usageId}/finish`);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("has already been finished");
  });

  it("PATCH /api/usages/:id/finish - deve retornar 404 para utilização inexistente", async () => {
    const res = await request(app).patch("/api/usages/00000000-0000-0000-0000-000000000000/finish");
    expect(res.status).toBe(404);
  });
});
