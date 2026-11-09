import { describe, expect, it, vi } from "vitest";
import { DeleteAutomobileUseCase } from "../../../../src/modules/automobiles/application/use-cases/delete-automobile.use-case.ts";
import type { IAutomobileRepositoryPort } from "../../../../src/modules/automobiles/application/ports/out/automobile-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import { Automobile } from "../../../../src/modules/automobiles/domain/entities/automobile.entity.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";
import { NotFoundError } from "../../../../src/modules/shared/domain/errors/not-found.error.ts";
import { ResourceInUseError } from "../../../../src/modules/shared/domain/errors/resource-in-use.error.ts";

describe("DeleteAutomobileUseCase (Application)", () => {
  it("deve lançar NotFoundError caso o automóvel a ser deletado não exista", async () => {
    const mockRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => null),
      delete: vi.fn(),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
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

    const useCase = new DeleteAutomobileUseCase(mockRepo, mockUsageRepo);

    await expect(useCase.execute({ id: "missing-id" })).rejects.toThrow(
      NotFoundError,
    );
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it("deve lançar ResourceInUseError se o automóvel estiver com utilização ativa", async () => {
    const existing = new Automobile("auto-1", "BRA2E19", "Azul", "Hyundai", true);
    const activeUsage = new Usage(
      "usage-1",
      "2026-03-01T10:00:00.000Z",
      null,
      "Em trânsito",
      { id: "driver-1", name: "Carlos" },
      { id: "auto-1", plate: "BRA2E19", color: "Azul", brand: "Hyundai" },
      true,
    );

    const mockRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => existing),
      delete: vi.fn(),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(async () => activeUsage),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new DeleteAutomobileUseCase(mockRepo, mockUsageRepo);

    await expect(useCase.execute({ id: "auto-1" })).rejects.toThrow(
      ResourceInUseError,
    );
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it("deve excluir o automóvel quando não houver utilização ativa", async () => {
    const existing = new Automobile("auto-1", "BRA2E19", "Azul", "Hyundai", true);

    const mockRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => existing),
      delete: vi.fn(async () => {}),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(async () => null),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new DeleteAutomobileUseCase(mockRepo, mockUsageRepo);
    await useCase.execute({ id: "auto-1" });

    expect(mockRepo.delete).toHaveBeenCalledWith("auto-1");
  });
});
