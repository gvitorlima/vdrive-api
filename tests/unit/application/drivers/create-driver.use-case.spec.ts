import { describe, expect, it, vi } from "vitest";
import { CreateDriverUseCase } from "../../../../src/modules/drivers/application/use-cases/create-driver.use-case.ts";
import type { IDriverRepositoryPort } from "../../../../src/modules/drivers/application/ports/out/driver-repository.port.ts";
import { Driver } from "../../../../src/modules/drivers/domain/entities/driver.entity.ts";

describe("CreateDriverUseCase (Application)", () => {
  it("deve criar um motorista e delegar para o repositório", async () => {
    const mockRepo: IDriverRepositoryPort = {
      create: vi.fn(async (driver: Driver) => driver),
      findById: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new CreateDriverUseCase(mockRepo);
    const result = await useCase.execute({ name: "Carlos Eduardo Silva" });

    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    const savedEntity = vi.mocked(mockRepo.create).mock.calls[0][0];
    expect(savedEntity).toBeInstanceOf(Driver);
    expect(savedEntity.getName()).toBe("Carlos Eduardo Silva");
    expect(result).toBe(savedEntity);
  });
});
