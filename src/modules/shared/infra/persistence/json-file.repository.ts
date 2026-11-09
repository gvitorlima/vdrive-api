import { access, accessSync, readFileSync } from "node:fs";

export abstract class JsonFileRepository<T, M> {
  public filePath: string;
  constructor(filePath: string) {
    this.filePath = filePath;
  }

  protected async read(): Promise<T[]> {
    if (!(await this.existFile())) {
      throw new Error("Database is not defined");
    }

    const content = await readFileSync(this.filePath, "utf-8");
    return JSON.parse(content);
  }

  protected async save(): Promise<boolean> {
    return true;
  }

  private async existFile(): Promise<boolean> {
    try {
      accessSync(this.filePath);
      return true;
    } catch {
      return false;
    }
  }
}
