import path from "node:path";
import { env } from "../../../config.ts";
import { JsonFileRepository } from "../../../shared/infra/persistence/json-file.repository.ts";
import type { IDriverRepositoryPort } from "../../application/ports/out/driver-repository.port.ts";
import { Driver } from "../../domain/entities/driver.entity.ts";

type DriverObject = {
  id: string;
  nome: string;
};

export class DriverRepositoryAdapter
  extends JsonFileRepository<DriverObject, any>
  implements IDriverRepositoryPort
{
  constructor(filePath?: string) {
    super(
      filePath ?? path.resolve(process.cwd(), env.DATABASE_DIR, "drivers.json"),
    );
  }

  public async list(name?: string): Promise<Driver[]> {
    let drivers = await super.read();

    /**
     * Simula LIKE simples no banco, tive de delegar isso para a aplicação
     * via filter por conta do banco em memoria.
     */
    if (name) {
      drivers = drivers.filter((driver) =>
        driver.nome.toLowerCase().includes(name.toLocaleLowerCase()),
      );
    }

    return drivers.map((driver) => new Driver(driver.id, driver.nome, true));
  }

  public async findById(id: string): Promise<Driver | null> {
    const drivers = await super.read();
    const driver = drivers.find((driver) => driver.id === id);

    if (!driver) {
      return null;
    }

    return new Driver(driver.id, driver.nome, true);
  }

  public async create(driver: Driver): Promise<Driver> {
    const drivers = await super.read();

    drivers.push(driver.toObject());
    await super.save(drivers);

    driver.markHasSaved();
    return driver;
  }

  public async update(driver: Driver): Promise<Driver> {
    const drivers = await super.read();

    const updated = drivers.map((d) =>
      d.id === driver.getId() ? driver.toObject() : d,
    );

    await super.save(updated);
    return driver;
  }

  public async delete(id: string): Promise<void> {
    const drivers = await super.read();
    const filtered = drivers.filter((driver) => driver.id !== id);
    await super.save(filtered);
  }
}
