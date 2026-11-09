import { randomUUID } from "node:crypto";

export class Driver {
  private readonly id: string;
  private readonly name: string;
  private wasSaved: boolean;

  constructor(id: string, name: string, wasSaved: boolean = false) {
    this.id = id;
    this.name = name;
    this.wasSaved = wasSaved;
  }

  static create(name: string): Driver {
    return new Driver(randomUUID(), name, false);
  }

  public isSaved(): boolean {
    return this.wasSaved;
  }

  public markHasSaved(): void {
    this.wasSaved = true;
  }
}
