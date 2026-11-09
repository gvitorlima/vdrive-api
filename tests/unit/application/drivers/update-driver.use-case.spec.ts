import { describe, expect, it, vi } from "vitest";
import { UpdateDriverUseCase } from "../../../../src/modules/drivers/application/use-cases/update-driver.use-case.ts";
import type { IDriverRepositoryPort } from "../../../../src/modules/drivers/application/ports/out/driver-repository.port.ts";
import { Driver } from "../../../../src/modules/drivers/domain/entities/driver.entity.ts";
import { NotFoundError } from "../../../../src/modules/shared/domain/errors/not-found.error.ts";

describe("UpdateDriverUseCase (Application)", () => {
  it("deve lançar NotFoundError caso o motorista a ser atualizado não exista", async () => {
    const mockRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => null),
      update: vi.fn(),
      create: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new UpdateDriverUseCase(mockRepo);

    await expect(
      useCase.execute({
        id: "missing-id",
        name: "Nome Novo Valido",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("deve atualizar o nome do motorista e chamar repository.update()", async () => {
    const existing = new Driver("driver-1", "Carlos Silva", true);
    const mockRepo: IDriverRepositoryPort = {
      findById: vi.fn(async () => existing),
      update: vi.fn(async (d: Driver) => d),
      create: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new UpdateDriverUseCase(mockRepo);
    const result = await useCase.execute({
      id: "driver-1",
      name: "Carlos Eduardo Silva",
    });

    expect(mockRepo.findById).toHaveBeenCalledWith("driver-1");
    expect(mockRepo.update).toHaveBeenCalledTimes(1);
    expect(result.getId()).toBe("driver-1");
    expect(result.getName()).toBe("Carlos Eduardo Silva");
  });
});
