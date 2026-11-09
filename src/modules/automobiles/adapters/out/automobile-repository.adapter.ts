import path from "node:path";
import { env } from "../../../config.ts";
import { JsonFileRepository } from "../../../shared/infra/persistence/json-file.repository.ts";
import type { IAutomobileRepositoryPort } from "../../application/ports/out/automobile-repository.port.ts";
import { Automobile } from "../../domain/entities/automobile.entity.ts";

type AutomobileObject = {
  id: string;
  placa: string;
  cor: string;
  marca: string;
};

export class AutomobileRepositoryAdapter
  extends JsonFileRepository<AutomobileObject, any>
  implements IAutomobileRepositoryPort
{
  constructor(filePath?: string) {
    super(
      filePath ??
        path.resolve(process.cwd(), env.DATABASE_DIR, "automobiles.json"),
    );
  }

  public async list(color?: string, brand?: string): Promise<Automobile[]> {
    let automobiles = await super.read();

    /**
     * Simula filtros LIKE combinados por conta do banco em memória
     */
    if (color) {
      automobiles = automobiles.filter((a) =>
        a.cor.toLowerCase().includes(color.toLowerCase()),
      );
    }

    if (brand) {
      automobiles = automobiles.filter((a) =>
        a.marca.toLowerCase().includes(brand.toLowerCase()),
      );
    }

    return automobiles.map(
      (a) => new Automobile(a.id, a.placa, a.cor, a.marca, true),
    );
  }

  public async findById(id: string): Promise<Automobile | null> {
    const automobiles = await super.read();
    const found = automobiles.find((a) => a.id === id);

    if (!found) {
      return null;
    }

    return new Automobile(found.id, found.placa, found.cor, found.marca, true);
  }

  public async create(automobile: Automobile): Promise<Automobile> {
    const automobiles = await super.read();

    automobiles.push(automobile.toObject());
    await super.save(automobiles);

    automobile.markHasSaved();
    return automobile;
  }

  public async update(automobile: Automobile): Promise<Automobile> {
    const automobiles = await super.read();

    const updated = automobiles.map((a) =>
      a.id === automobile.getId() ? automobile.toObject() : a,
    );

    await super.save(updated);
    return automobile;
  }

  public async delete(id: string): Promise<void> {
    const automobiles = await super.read();
    const filtered = automobiles.filter((a) => a.id !== id);
    await super.save(filtered);
  }
}
