import path from "node:path";
import { JsonFileRepository } from "../../../shared/infra/persistence/json-file.repository.ts";
import type { CreateDriverInput } from "../../application/inputs/create-driver.input.ts";
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
  constructor() {
    super(path.resolve(process.cwd(), "database/drivers.json"));
  }

  public async list(name?: string): Promise<Driver[]> {
    let drivers = await super.read();

    /**
     * Simula LIKE simples no banco, tive de delegar isso para a aplicação
     * via filter por conta do banco em memoria.
     */
    if (name) {
      console.log(name);
      drivers = drivers.filter((driver) =>
        driver.nome.toLowerCase().includes(name.toLocaleLowerCase()),
      );
    }

    return drivers.map((driver) => new Driver(driver.id, driver.nome, true));
  }

  public async get() {}
  public async create(content: CreateDriverInput) {}
  public async update() {}
  public async delete() {}
}
