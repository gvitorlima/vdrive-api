import { describe, expect, it } from "vitest";
import { Usage } from "../../../src/modules/usages/domain/entities/usage.entity.ts";

describe("Usage Entity (Domain)", () => {
  const mockDriver = { id: "driver-1", name: "Carlos Silva" };
  const mockAuto = {
    id: "auto-1",
    plate: "BRA2E19",
    color: "Azul",
    brand: "Hyundai",
  };

  it("deve criar uma nova instância de Usage com datas e snapshots corretos", () => {
    const beforeCreation = new Date().getTime();
    const usage = Usage.create("Viagem a negócios", mockDriver, mockAuto);
    const afterCreation = new Date().getTime();

    expect(usage.getId()).toBeDefined();
    expect(usage.getId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(usage.getReason()).toBe("Viagem a negócios");
    expect(usage.getDriver()).toEqual(mockDriver);
    expect(usage.getAutomobile()).toEqual(mockAuto);
    expect(usage.getEndDate()).toBeNull();
    expect(usage.isActive()).toBe(true);
    expect(usage.isSaved()).toBe(false);

    const startTime = new Date(usage.getStartDate()).getTime();
    expect(startTime).toBeGreaterThanOrEqual(beforeCreation);
    expect(startTime).toBeLessThanOrEqual(afterCreation);
  });

  it("deve finalizar uma utilização ativa alterando endDate e o status isActive()", () => {
    const usage = Usage.create("Entrega de mercadorias", mockDriver, mockAuto);
    expect(usage.isActive()).toBe(true);
    expect(usage.getEndDate()).toBeNull();

    usage.finish();

    expect(usage.isActive()).toBe(false);
    expect(usage.getEndDate()).not.toBeNull();
    expect(typeof usage.getEndDate()).toBe("string");
  });

  it("deve serializar para o formato esperado por toObject() quando ativo", () => {
    const usage = new Usage(
      "usage-uuid",
      "2026-03-01T10:00:00.000Z",
      null,
      "Visita técnica",
      mockDriver,
      mockAuto,
      true,
    );

    expect(usage.toObject()).toEqual({
      id: "usage-uuid",
      data_inicio: "2026-03-01T10:00:00.000Z",
      data_termino: null,
      motivo_utilizacao: "Visita técnica",
      motorista: {
        id: "driver-1",
        nome: "Carlos Silva",
      },
      automovel: {
        id: "auto-1",
        placa: "BRA2E19",
        cor: "Azul",
        marca: "Hyundai",
      },
    });
  });

  it("deve serializar com data_termino preenchido após finalização", () => {
    const usage = new Usage(
      "usage-uuid",
      "2026-03-01T10:00:00.000Z",
      "2026-03-01T12:00:00.000Z",
      "Visita técnica concluída",
      mockDriver,
      mockAuto,
      true,
    );

    expect(usage.isActive()).toBe(false);
    expect(usage.toObject().data_termino).toBe("2026-03-01T12:00:00.000Z");
  });

  it("deve alterar o estado para salvo via markHasSaved()", () => {
    const usage = Usage.create("Teste", mockDriver, mockAuto);
    expect(usage.isSaved()).toBe(false);

    usage.markHasSaved();
    expect(usage.isSaved()).toBe(true);
  });
});
