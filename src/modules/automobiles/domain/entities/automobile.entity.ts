import { randomUUID } from "node:crypto";

export class Automobile {
  private readonly id: string;
  private readonly plate: string;
  private readonly color: string;
  private readonly brand: string;
  private wasSaved: boolean;

  constructor(
    id: string,
    plate: string,
    color: string,
    brand: string,
    wasSaved: boolean = false,
  ) {
    this.id = id;
    this.plate = plate;
    this.color = color;
    this.brand = brand;
    this.wasSaved = wasSaved;
  }

  static create(plate: string, color: string, brand: string): Automobile {
    return new Automobile(randomUUID(), plate, color, brand, false);
  }

  public getId(): string {
    return this.id;
  }

  public getPlate(): string {
    return this.plate;
  }

  public getColor(): string {
    return this.color;
  }

  public getBrand(): string {
    return this.brand;
  }

  /**
   * Por ser um PUT, deixei todos os parâmetros obrigatórios
   * 
   * @param plate 
   * @param color 
   * @param brand 
   * @returns 
   */
  public update(plate: string, color: string, brand: string): Automobile {
    return new Automobile(this.id, plate, color, brand, this.wasSaved);
  }

  public toObject(): { id: string; placa: string; cor: string; marca: string } {
    return {
      id: this.id,
      placa: this.plate,
      cor: this.color,
      marca: this.brand,
    };
  }

  public isSaved(): boolean {
    return this.wasSaved;
  }

  public markHasSaved(): void {
    this.wasSaved = true;
  }
}
