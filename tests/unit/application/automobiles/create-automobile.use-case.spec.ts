import { describe, expect, it, vi } from "vitest";
import { CreateAutomobileUseCase } from "../../../../src/modules/automobiles/application/use-cases/create-automobile.use-case.ts";
import type { IAutomobileRepositoryPort } from "../../../../src/modules/automobiles/application/ports/out/automobile-repository.port.ts";
import { Automobile } from "../../../../src/modules/automobiles/domain/entities/automobile.entity.ts";

describe("CreateAutomobileUseCase (Application)", () => {
  it("deve criar um automóvel e delegar para o repositório", async () => {
    const mockRepo: IAutomobileRepositoryPort = {
      create: vi.fn(async (auto: Automobile) => auto),
      findById: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new CreateAutomobileUseCase(mockRepo);
    const result = await useCase.execute({
      plate: "BRA2E19",
      color: "Azul",
      brand: "Hyundai",
    });

    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    const savedEntity = vi.mocked(mockRepo.create).mock.calls[0][0];
    expect(savedEntity).toBeInstanceOf(Automobile);
    expect(savedEntity.getPlate()).toBe("BRA2E19");
    expect(savedEntity.getColor()).toBe("Azul");
    expect(savedEntity.getBrand()).toBe("Hyundai");
    expect(result).toBe(savedEntity);
  });
});
