import { describe, expect, it } from "vitest";
import { Automobile } from "../../../src/modules/automobiles/domain/entities/automobile.entity.ts";

describe("Automobile Entity (Domain)", () => {
  it("deve criar uma nova instância de Automobile via método factory com valores corretos", () => {
    const auto = Automobile.create("BRA2E19", "Azul", "Hyundai");

    expect(auto.getId()).toBeDefined();
    expect(auto.getId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(auto.getPlate()).toBe("BRA2E19");
    expect(auto.getColor()).toBe("Azul");
    expect(auto.getBrand()).toBe("Hyundai");
    expect(auto.isSaved()).toBe(false);
  });

  it("deve instanciar via construtor respeitando wasSaved fornecido", () => {
    const autoNotSaved = new Automobile("123", "ABC1234", "Preto", "Ford");
    expect(autoNotSaved.isSaved()).toBe(false);

    const autoSaved = new Automobile("123", "ABC1234", "Preto", "Ford", true);
    expect(autoSaved.isSaved()).toBe(true);
  });

  it("deve atualizar os atributos criando uma nova instância e preservando o id e wasSaved", () => {
    const original = new Automobile("uuid-123", "ABC1234", "Preto", "Ford", true);
    const updated = original.update("XYZ9876", "Branco", "Chevrolet");

    expect(updated).not.toBe(original);
    expect(updated.getId()).toBe("uuid-123");
    expect(updated.getPlate()).toBe("XYZ9876");
    expect(updated.getColor()).toBe("Branco");
    expect(updated.getBrand()).toBe("Chevrolet");
    expect(updated.isSaved()).toBe(true);
  });

  it("deve serializar corretamente para objeto via toObject()", () => {
    const auto = new Automobile("uuid-456", "BRA2E19", "Prata", "Toyota", false);

    expect(auto.toObject()).toEqual({
      id: "uuid-456",
      placa: "BRA2E19",
      cor: "Prata",
      marca: "Toyota",
    });
  });

  it("deve alterar o estado para salvo via markHasSaved()", () => {
    const auto = Automobile.create("BRA2E19", "Azul", "Hyundai");
    expect(auto.isSaved()).toBe(false);

    auto.markHasSaved();
    expect(auto.isSaved()).toBe(true);
  });
});
