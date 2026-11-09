import { describe, expect, it, vi } from "vitest";
import { ListAutomobilesUseCase } from "../../../../src/modules/automobiles/application/use-cases/list-automobiles.use-case.ts";
import type { IAutomobileRepositoryPort } from "../../../../src/modules/automobiles/application/ports/out/automobile-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import { Automobile } from "../../../../src/modules/automobiles/domain/entities/automobile.entity.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";

describe("ListAutomobilesUseCase (Application)", () => {
  it("deve repassar filtros para o repositório e enriquecer os automóveis com inUse e history", async () => {
    const auto1 = new Automobile("auto-1", "BRA2E19", "Azul", "Hyundai", true);
    const auto2 = new Automobile("auto-2", "XYZ9876", "Preto", "Honda", true);

    const activeUsage = new Usage(
      "usage-1",
      "2026-03-01T10:00:00.000Z",
      null,
      "Serviço",
      { id: "driver-1", name: "Carlos" },
      { id: "auto-1", plate: "BRA2E19", color: "Azul", brand: "Hyundai" },
      true,
    );

    const mockRepo: IAutomobileRepositoryPort = {
      list: vi.fn(async () => [auto1, auto2]),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(async (autoId) =>
        autoId === "auto-1" ? activeUsage : null,
      ),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(async (autoId) =>
        autoId === "auto-1" ? [activeUsage] : [],
      ),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new ListAutomobilesUseCase(mockRepo, mockUsageRepo);
    const result = await useCase.execute({ color: "Azul", brand: "Hyundai" });

    expect(mockRepo.list).toHaveBeenCalledWith("Azul", "Hyundai");
    expect(result).toHaveLength(2);

    expect(result[0].id).toBe("auto-1");
    expect(result[0].inUse).toBe(true);
    expect(result[0].history).toHaveLength(1);

    expect(result[1].id).toBe("auto-2");
    expect(result[1].inUse).toBe(false);
    expect(result[1].history).toEqual([]);
  });

  it("deve retornar lista vazia se o repositório não encontrar nenhum automóvel", async () => {
    const mockRepo: IAutomobileRepositoryPort = {
      list: vi.fn(async () => []),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new ListAutomobilesUseCase(mockRepo, mockUsageRepo);
    const result = await useCase.execute({});

    expect(result).toEqual([]);
  });
});
