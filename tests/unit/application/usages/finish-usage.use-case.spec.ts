import { describe, expect, it, vi } from "vitest";
import { FinishUsageUseCase } from "../../../../src/modules/usages/application/use-cases/finish-usage.use-case.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";
import { NotFoundError } from "../../../../src/modules/shared/domain/errors/not-found.error.ts";

describe("FinishUsageUseCase (Application)", () => {
  const driverSnapshot = { id: "driver-1", name: "Carlos" };
  const autoSnapshot = {
    id: "auto-1",
    plate: "BRA2E19",
    color: "Azul",
    brand: "Hyundai",
  };

  it("deve lançar NotFoundError caso a utilização não exista", async () => {
    const mockRepo: IUsageRepositoryPort = {
      findById: vi.fn(async () => null),
      update: vi.fn(),
      create: vi.fn(),
      list: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
    };

    const useCase = new FinishUsageUseCase(mockRepo);

    await expect(useCase.execute({ id: "missing-usage" })).rejects.toThrow(
      NotFoundError,
    );
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it("deve lançar erro ao tentar finalizar utilização que já foi encerrada", async () => {
    const finishedUsage = new Usage(
      "usage-1",
      "2026-03-01T10:00:00.000Z",
      "2026-03-01T12:00:00.000Z",
      "Viagem concluída",
      driverSnapshot,
      autoSnapshot,
      true,
    );

    const mockRepo: IUsageRepositoryPort = {
      findById: vi.fn(async () => finishedUsage),
      update: vi.fn(),
      create: vi.fn(),
      list: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
    };

    const useCase = new FinishUsageUseCase(mockRepo);

    await expect(useCase.execute({ id: "usage-1" })).rejects.toThrow(
      'Usage with id "usage-1" has already been finished',
    );
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it("deve finalizar utilização ativa e salvar via repository.update()", async () => {
    const activeUsage = new Usage(
      "usage-1",
      "2026-03-01T10:00:00.000Z",
      null,
      "Em andamento",
      driverSnapshot,
      autoSnapshot,
      true,
    );

    const mockRepo: IUsageRepositoryPort = {
      findById: vi.fn(async () => activeUsage),
      update: vi.fn(async (u: Usage) => u),
      create: vi.fn(),
      list: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
    };

    const useCase = new FinishUsageUseCase(mockRepo);
    const result = await useCase.execute({ id: "usage-1" });

    expect(mockRepo.findById).toHaveBeenCalledWith("usage-1");
    expect(mockRepo.update).toHaveBeenCalledTimes(1);
    expect(result.isActive()).toBe(false);
    expect(result.getEndDate()).not.toBeNull();
  });
});
