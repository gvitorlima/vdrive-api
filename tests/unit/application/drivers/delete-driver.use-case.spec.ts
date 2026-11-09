import { describe, expect, it, vi } from "vitest";
import { DeleteDriverUseCase } from "../../../../src/modules/drivers/application/use-cases/delete-driver.use-case.ts";
import type { IDriverRepositoryPort } from "../../../../src/modules/drivers/application/ports/out/driver-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import { Driver } from "../../../../src/modules/drivers/domain/entities/driver.entity.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";
import { NotFoundError } from "../../../../src/modules/shared/domain/errors/not-found.error.ts";
import { ResourceInUseError } from "../../../../src/modules/shared/domain/errors/resource-in-use.error.ts";

describe("DeleteDriverUseCase (Application)", () => {
  it("deve lançar NotFoundError caso o motorista a ser deletado não exista", async () => {
    const mockRepo: IDriverRepositoryPort = {
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

    const useCase = new DeleteDriverUseCase(mockRepo, mockUsageRepo);

    await expect(useCase.execute({ id: "missing-id" })).rejects.toThrow(
      NotFoundError,
    );
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it("deve lançar ResourceInUseError se o motorista estiver em utilização ativa", async () => {
    const existing = new Driver("driver-1", "Carlos Silva", true);
    const activeUsage = new Usage(
      "usage-1",
      "2026-03-01T10:00:00.000Z",
      null,
      "Em trânsito",
      { id: "driver-1", name: "Carlos Silva" },
      { id: "auto-1", plate: "BRA2E19", color: "Azul", brand: "Hyundai" },
      true,
    );

    const mockRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => existing),
      delete: vi.fn(),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(async () => activeUsage),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new DeleteDriverUseCase(mockRepo, mockUsageRepo);

    await expect(useCase.execute({ id: "driver-1" })).rejects.toThrow(
      ResourceInUseError,
    );
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it("deve excluir o motorista quando não houver utilização ativa", async () => {
    const existing = new Driver("driver-1", "Carlos Silva", true);

    const mockRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => existing),
      delete: vi.fn(async () => {}),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      list: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(async () => null),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new DeleteDriverUseCase(mockRepo, mockUsageRepo);
    await useCase.execute({ id: "driver-1" });

    expect(mockRepo.delete).toHaveBeenCalledWith("driver-1");
  });
});
