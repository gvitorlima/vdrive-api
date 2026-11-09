import { describe, expect, it, vi } from "vitest";
import { GetAutomobileUseCase } from "../../../../src/modules/automobiles/application/use-cases/get-automobile.use-case.ts";
import type { IAutomobileRepositoryPort } from "../../../../src/modules/automobiles/application/ports/out/automobile-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import { Automobile } from "../../../../src/modules/automobiles/domain/entities/automobile.entity.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";
import { NotFoundError } from "../../../../src/modules/shared/domain/errors/not-found.error.ts";

describe("GetAutomobileUseCase (Application)", () => {
  it("deve lançar NotFoundError caso o automóvel não exista no repositório", async () => {
    const mockRepo: IAutomobileRepositoryPort = {
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

    const useCase = new GetAutomobileUseCase(mockRepo, mockUsageRepo);

    await expect(useCase.execute({ id: "invalid-id" })).rejects.toThrow(
      NotFoundError,
    );
    expect(mockRepo.findById).toHaveBeenCalledWith("invalid-id");
  });

  it("deve retornar o automóvel com inUse = true quando houver uso ativo", async () => {
    const auto = new Automobile("auto-1", "BRA2E19", "Azul", "Hyundai", true);
    const activeUsage = new Usage(
      "usage-1",
      "2026-03-01T10:00:00.000Z",
      null,
      "Entrega",
      { id: "driver-1", name: "Carlos" },
      { id: "auto-1", plate: "BRA2E19", color: "Azul", brand: "Hyundai" },
      true,
    );

    const mockRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => auto),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(async () => activeUsage),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(async () => [activeUsage]),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new GetAutomobileUseCase(mockRepo, mockUsageRepo);
    const result = await useCase.execute({ id: "auto-1" });

    expect(result.id).toBe("auto-1");
    expect(result.placa).toBe("BRA2E19");
    expect(result.inUse).toBe(true);
    expect(result.history).toHaveLength(1);
    expect(result.history[0].id).toBe("usage-1");
  });

  it("deve retornar o automóvel com inUse = false quando não houver uso ativo", async () => {
    const auto = new Automobile("auto-1", "BRA2E19", "Azul", "Hyundai", true);

    const mockRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => auto),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(async () => null),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(async () => []),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new GetAutomobileUseCase(mockRepo, mockUsageRepo);
    const result = await useCase.execute({ id: "auto-1" });

    expect(result.inUse).toBe(false);
    expect(result.history).toEqual([]);
  });
});
