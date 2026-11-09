import { describe, expect, it, vi } from "vitest";
import { CreateUsageUseCase } from "../../../../src/modules/usages/application/use-cases/create-usage.use-case.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import type { IDriverRepositoryPort } from "../../../../src/modules/drivers/application/ports/out/driver-repository.port.ts";
import type { IAutomobileRepositoryPort } from "../../../../src/modules/automobiles/application/ports/out/automobile-repository.port.ts";
import { Driver } from "../../../../src/modules/drivers/domain/entities/driver.entity.ts";
import { Automobile } from "../../../../src/modules/automobiles/domain/entities/automobile.entity.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";
import { NotFoundError } from "../../../../src/modules/shared/domain/errors/not-found.error.ts";
import { DriverInUseError } from "../../../../src/modules/shared/domain/errors/driver-in-use.error.ts";
import { AutomobileInUseError } from "../../../../src/modules/shared/domain/errors/automobile-in-use.error.ts";

describe("CreateUsageUseCase (Application)", () => {
  const driver = new Driver("driver-1", "Carlos Eduardo Silva", true);
  const auto = new Automobile("auto-1", "BRA2E19", "Azul", "Hyundai", true);
  const existingUsage = new Usage(
    "usage-existing",
    "2026-03-01T10:00:00.000Z",
    null,
    "Uso anterior",
    { id: "driver-1", name: "Carlos" },
    { id: "auto-1", plate: "BRA2E19", color: "Azul", brand: "Hyundai" },
    true,
  );

  it("deve lançar NotFoundError se o motorista não for encontrado", async () => {
    const mockDriverRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => null),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockAutoRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => auto),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      create: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new CreateUsageUseCase(
      mockUsageRepo,
      mockDriverRepo,
      mockAutoRepo,
    );

    await expect(
      useCase.execute({
        driverId: "missing-driver",
        automobileId: "auto-1",
        reason: "Viagem técnica",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar NotFoundError se o automóvel não for encontrado", async () => {
    const mockDriverRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => driver),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockAutoRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => null),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      create: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new CreateUsageUseCase(
      mockUsageRepo,
      mockDriverRepo,
      mockAutoRepo,
    );

    await expect(
      useCase.execute({
        driverId: "driver-1",
        automobileId: "missing-auto",
        reason: "Viagem técnica",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar DriverInUseError [Regra R2] se o motorista já possuir utilização ativa", async () => {
    const mockDriverRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => driver),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockAutoRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => auto),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      create: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(async () => existingUsage),
      findActiveByAutomobileId: vi.fn(async () => null),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new CreateUsageUseCase(
      mockUsageRepo,
      mockDriverRepo,
      mockAutoRepo,
    );

    await expect(
      useCase.execute({
        driverId: "driver-1",
        automobileId: "auto-1",
        reason: "Segunda utilização simultânea",
      }),
    ).rejects.toThrow(DriverInUseError);
  });

  it("deve lançar AutomobileInUseError [Regra R3] se o automóvel já estiver em uso ativo", async () => {
    const mockDriverRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => driver),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockAutoRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => auto),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      create: vi.fn(),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(async () => null),
      findActiveByAutomobileId: vi.fn(async () => existingUsage),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new CreateUsageUseCase(
      mockUsageRepo,
      mockDriverRepo,
      mockAutoRepo,
    );

    await expect(
      useCase.execute({
        driverId: "driver-1",
        automobileId: "auto-1",
        reason: "Tentativa de uso duplo do automóvel",
      }),
    ).rejects.toThrow(AutomobileInUseError);
  });

  it("deve criar e salvar utilização com sucesso quando todas as regras forem satisfeitas", async () => {
    const mockDriverRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => driver),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockAutoRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => auto),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const mockUsageRepo: IUsageRepositoryPort = {
      create: vi.fn(async (usage: Usage) => usage),
      findById: vi.fn(),
      findActiveByDriverId: vi.fn(async () => null),
      findActiveByAutomobileId: vi.fn(async () => null),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new CreateUsageUseCase(
      mockUsageRepo,
      mockDriverRepo,
      mockAutoRepo,
    );

    const result = await useCase.execute({
      driverId: "driver-1",
      automobileId: "auto-1",
      reason: "Entrega de documentos fiscais",
    });

    expect(mockUsageRepo.create).toHaveBeenCalledTimes(1);
    expect(result.getReason()).toBe("Entrega de documentos fiscais");
    expect(result.getDriver()).toEqual({ id: "driver-1", name: "Carlos Eduardo Silva" });
    expect(result.getAutomobile()).toEqual({
      id: "auto-1",
      plate: "BRA2E19",
      color: "Azul",
      brand: "Hyundai",
    });
    expect(result.isActive()).toBe(true);
  });
});
