import { describe, expect, it, vi } from "vitest";
import { ListUsagesUseCase } from "../../../../src/modules/usages/application/use-cases/list-usages.use-case.ts";
import type { IUsageRepositoryPort } from "../../../../src/modules/usages/application/ports/out/usage-repository.port.ts";
import { Usage } from "../../../../src/modules/usages/domain/entities/usage.entity.ts";

describe("ListUsagesUseCase (Application)", () => {
  it("deve retornar todas as utilizações fornecidas pelo repositório", async () => {
    const u1 = new Usage(
      "usage-1",
      "2026-03-01T10:00:00.000Z",
      null,
      "Uso 1",
      { id: "d-1", name: "Carlos" },
      { id: "a-1", plate: "BRA2E19", color: "Azul", brand: "Hyundai" },
      true,
    );
    const u2 = new Usage(
      "usage-2",
      "2026-03-01T11:00:00.000Z",
      "2026-03-01T12:00:00.000Z",
      "Uso 2",
      { id: "d-2", name: "Ana" },
      { id: "a-2", plate: "XYZ9876", color: "Preto", brand: "Honda" },
      true,
    );

    const mockRepo: IUsageRepositoryPort = {
      list: vi.fn(async () => [u1, u2]),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findActiveByDriverId: vi.fn(),
      findActiveByAutomobileId: vi.fn(),
      findAllByDriverId: vi.fn(),
      findAllByAutomobileId: vi.fn(),
    };

    const useCase = new ListUsagesUseCase(mockRepo);
    const result = await useCase.execute({});

    expect(mockRepo.list).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].getId()).toBe("usage-1");
    expect(result[1].getId()).toBe("usage-2");
  });
});
