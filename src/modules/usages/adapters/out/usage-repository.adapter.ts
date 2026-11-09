import path from "node:path";
import { env } from "../../../config.ts";
import { JsonFileRepository } from "../../../shared/infra/persistence/json-file.repository.ts";
import type { IUsageRepositoryPort } from "../../application/ports/out/usage-repository.port.ts";
import { Usage } from "../../domain/entities/usage.entity.ts";

type UsageObject = {
  id: string;
  data_inicio: string;
  data_termino: string | null;
  motivo_utilizacao: string;
  motorista: { id: string; nome: string };
  automovel: { id: string; placa: string; cor: string; marca: string };
};

export class UsageRepositoryAdapter
  extends JsonFileRepository<UsageObject, any>
  implements IUsageRepositoryPort
{
  constructor(filePath?: string) {
    super(
      filePath ??
        path.resolve(process.cwd(), env.DATABASE_DIR, "automobile-driver.json"),
    );
  }

  private mapToEntity(obj: UsageObject): Usage {
    return new Usage(
      obj.id,
      obj.data_inicio,
      obj.data_termino,
      obj.motivo_utilizacao,
      { id: obj.motorista.id, name: obj.motorista.nome },
      {
        id: obj.automovel.id,
        plate: obj.automovel.placa,
        color: obj.automovel.cor,
        brand: obj.automovel.marca,
      },
      true,
    );
  }

  public async list(): Promise<Usage[]> {
    const usages = await super.read();
    return usages.map((u) => this.mapToEntity(u));
  }

  public async findById(id: string): Promise<Usage | null> {
    const usages = await super.read();
    const found = usages.find((u) => u.id === id);

    if (!found) {
      return null;
    }

    return this.mapToEntity(found);
  }

  /**
   * Busca uso ativo (data_termino === null) por motorista.
   * Usado para validar regras R2 e R4.
   */
  public async findActiveByDriverId(driverId: string): Promise<Usage | null> {
    const usages = await super.read();
    const found = usages.find(
      (u) => u.motorista.id === driverId && u.data_termino === null,
    );

    if (!found) {
      return null;
    }

    return this.mapToEntity(found);
  }

  /**
   * Busca uso ativo (data_termino === null) por automóvel.
   * Usado para validar regras R3 e R4.
   */
  public async findActiveByAutomobileId(
    automobileId: string,
  ): Promise<Usage | null> {
    const usages = await super.read();
    const found = usages.find(
      (u) => u.automovel.id === automobileId && u.data_termino === null,
    );

    if (!found) {
      return null;
    }

    return this.mapToEntity(found);
  }

  /**
   * Busca todo o histórico de utilizações de um motorista.
   */
  public async findAllByDriverId(driverId: string): Promise<Usage[]> {
    const usages = await super.read();
    const found = usages.filter((u) => u.motorista.id === driverId);
    return found.map((u) => this.mapToEntity(u));
  }

  /**
   * Busca todo o histórico de utilizações de um automóvel.
   */
  public async findAllByAutomobileId(
    automobileId: string,
  ): Promise<Usage[]> {
    const usages = await super.read();
    const found = usages.filter((u) => u.automovel.id === automobileId);
    return found.map((u) => this.mapToEntity(u));
  }

  public async create(usage: Usage): Promise<Usage> {
    const usages = await super.read();

    usages.push(usage.toObject());
    await super.save(usages);

    usage.markHasSaved();
    return usage;
  }

  public async update(usage: Usage): Promise<Usage> {
    const usages = await super.read();

    const updated = usages.map((u) =>
      u.id === usage.getId() ? usage.toObject() : u,
    );

    await super.save(updated);
    return usage;
  }
}
