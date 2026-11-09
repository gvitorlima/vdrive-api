import { describe, expect, it, vi } from "vitest";
import { ListDriversUseCase } from "../../../../src/modules/drivers/application/use-cases/list-drivers.use-case.ts";
import type { IDriverRepositoryPort } from "../../../../src/modules/drivers/application/ports/out/driver-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import { Driver } from "../../../../src/modules/drivers/domain/entities/driver.entity.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";

describe("ListDriversUseCase (Application)", () => {
  it("deve repassar filtro de nome e enriquecer motoristas com inUse e history", async () => {
    const d1 = new Driver("driver-1", "Carlos Silva", true);
    const d2 = new Driver("driver-2", "Ana Souza", true);

    const activeUsage = new Usage(
      "usage-1",
      "2026-03-01T10:00:00.000Z",
      null,
      "Serviço",
      { id: "driver-1", name: "Carlos Silva" },
      { id: "auto-1", plate: "BRA2E19", color: "Azul", brand: "Hyundai" },
      true,
    );

    const mockRepo: IDriverRepositoryPort = {
      list: vi.fn(async () => [d1, d2]),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(async (driverId) =>
        driverId === "driver-1" ? activeUsage : null,
      ),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(async (driverId) =>
        driverId === "driver-1" ? [activeUsage] : [],
      ),
      findAllByAutomobileId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new ListDriversUseCase(mockRepo, mockUsageRepo);
    const result = await useCase.execute({ name: "Carlos" });

    expect(mockRepo.list).toHaveBeenCalledWith("Carlos");
    expect(result).toHaveLength(2);

    expect(result[0].id).toBe("driver-1");
    expect(result[0].inUse).toBe(true);
    expect(result[0].history).toHaveLength(1);

    expect(result[1].id).toBe("driver-2");
    expect(result[1].inUse).toBe(false);
    expect(result[1].history).toEqual([]);
  });

  it("deve retornar lista vazia se nenhum motorista for retornado", async () => {
    const mockRepo: IDriverRepositoryPort = {
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

    const useCase = new ListDriversUseCase(mockRepo, mockUsageRepo);
    const result = await useCase.execute({});

    expect(result).toEqual([]);
  });
});
