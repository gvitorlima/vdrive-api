import { describe, expect, it, vi } from "vitest";
import { GetDriverUseCase } from "../../../../src/modules/drivers/application/use-cases/get-driver.use-case.ts";
import type { IDriverRepositoryPort } from "../../../../src/modules/drivers/application/ports/out/driver-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import { Driver } from "../../../../src/modules/drivers/domain/entities/driver.entity.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";
import { NotFoundError } from "../../../../src/modules/shared/domain/errors/not-found.error.ts";

describe("GetDriverUseCase (Application)", () => {
  it("deve lançar NotFoundError caso o motorista não exista", async () => {
    const mockRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => null),
      create: vi.fn(),
      list: vi.fn(),
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

    const useCase = new GetDriverUseCase(mockRepo, mockUsageRepo);

    await expect(useCase.execute({ id: "invalid-id" })).rejects.toThrow(
      NotFoundError,
    );
  });

  it("deve retornar o motorista com inUse = true quando houver uso ativo", async () => {
    const driver = new Driver("driver-1", "Carlos Silva", true);
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
      findById: vi.fn(async () => driver),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(async () => activeUsage),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(async () => [activeUsage]),
      findAllByAutomobileId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new GetDriverUseCase(mockRepo, mockUsageRepo);
    const result = await useCase.execute({ id: "driver-1" });

    expect(result.id).toBe("driver-1");
    expect(result.nome).toBe("Carlos Silva");
    expect(result.inUse).toBe(true);
    expect(result.history).toHaveLength(1);
  });

  it("deve retornar o motorista com inUse = false quando não houver uso ativo", async () => {
    const driver = new Driver("driver-1", "Carlos Silva", true);

    const mockRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => driver),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(async () => null),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(async () => []),
      findAllByAutomobileId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new GetDriverUseCase(mockRepo, mockUsageRepo);
    const result = await useCase.execute({ id: "driver-1" });

    expect(result.inUse).toBe(false);
    expect(result.history).toEqual([]);
  });
});
