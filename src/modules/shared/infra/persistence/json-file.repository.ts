import { accessSync, readFileSync, writeFileSync } from "node:fs";

export abstract class JsonFileRepository<T, M> {
  public filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  protected async read(): Promise<T[]> {
    if (!(await this.existFile())) {
      throw new Error("Database is not defined");
    }

    const content = readFileSync(this.filePath, "utf-8");
    return JSON.parse(content);
  }

  protected async save(data: T[]): Promise<void> {
    writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
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
