import { describe, expect, it, vi } from "vitest";
import { UpdateAutomobileUseCase } from "../../../../src/modules/automobiles/application/use-cases/update-automobile.use-case.ts";
import type { IAutomobileRepositoryPort } from "../../../../src/modules/automobiles/application/ports/out/automobile-repository.port.ts";
import { Automobile } from "../../../../src/modules/automobiles/domain/entities/automobile.entity.ts";
import { NotFoundError } from "../../../../src/modules/shared/domain/errors/not-found.error.ts";

describe("UpdateAutomobileUseCase (Application)", () => {
  it("deve lançar NotFoundError caso o automóvel a ser atualizado não exista", async () => {
    const mockRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => null),
      update: vi.fn(),
      create: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new UpdateAutomobileUseCase(mockRepo);

    await expect(
      useCase.execute({
        id: "missing-id",
        plate: "XYZ9999",
        color: "Prata",
        brand: "Toyota",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("deve atualizar os dados do automóvel e chamar repository.update()", async () => {
    const existing = new Automobile("auto-1", "ABC1234", "Azul", "Fiat", true);
    const mockRepo: IAutomobileRepositoryPort = {
      findById: vi.fn(async () => existing),
      update: vi.fn(async (auto: Automobile) => auto),
      create: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new UpdateAutomobileUseCase(mockRepo);
    const result = await useCase.execute({
      id: "auto-1",
      plate: "BRA2E19",
      color: "Cinza",
      brand: "Hyundai",
    });

    expect(mockRepo.findById).toHaveBeenCalledWith("auto-1");
    expect(mockRepo.update).toHaveBeenCalledTimes(1);

    expect(result.getId()).toBe("auto-1");
    expect(result.getPlate()).toBe("BRA2E19");
    expect(result.getColor()).toBe("Cinza");
    expect(result.getBrand()).toBe("Hyundai");
  });
});
