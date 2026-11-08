import type { CreateDriverInput } from "../../application/inputs/create-driver.input.ts";
import type { IDriverRepositoryPort } from "../../application/ports/out/driver-repository.port.ts";

export class DriverRepositoryAdapter implements IDriverRepositoryPort {
  public async list() {}
  public async get() {}
  public async create(content: CreateDriverInput) {}
  public async update() {}
  public async delete() {}
}
