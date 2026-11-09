import { describe, expect, it } from "vitest";
import { Driver } from "../../../src/modules/drivers/domain/entities/driver.entity.ts";

describe("Driver Entity (Domain)", () => {
  it("deve criar uma nova instância de Driver via método factory com valores corretos", () => {
    const driver = Driver.create("Carlos Eduardo Silva");

    expect(driver.getId()).toBeDefined();
    expect(driver.getId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(driver.getName()).toBe("Carlos Eduardo Silva");
    expect(driver.isSaved()).toBe(false);
  });

  it("deve instanciar via construtor respeitando wasSaved fornecido", () => {
    const driverNotSaved = new Driver("123", "Ana Souza");
    expect(driverNotSaved.isSaved()).toBe(false);

    const driverSaved = new Driver("123", "Ana Souza", true);
    expect(driverSaved.isSaved()).toBe(true);
  });

  it("deve atualizar o nome criando uma nova instância e preservando o id e wasSaved", () => {
    const original = new Driver("uuid-123", "Carlos Eduardo", true);
    const updated = original.update("Carlos Eduardo Silva");

    expect(updated).not.toBe(original);
    expect(updated.getId()).toBe("uuid-123");
    expect(updated.getName()).toBe("Carlos Eduardo Silva");
    expect(updated.isSaved()).toBe(true);
  });

  it("deve serializar corretamente para objeto via toObject()", () => {
    const driver = new Driver("uuid-456", "Roberto Pereira", false);

    expect(driver.toObject()).toEqual({
      id: "uuid-456",
      nome: "Roberto Pereira",
    });
  });

  it("deve alterar o estado para salvo via markHasSaved()", () => {
    const driver = Driver.create("Carlos Eduardo");
    expect(driver.isSaved()).toBe(false);

    driver.markHasSaved();
    expect(driver.isSaved()).toBe(true);
  });
});
