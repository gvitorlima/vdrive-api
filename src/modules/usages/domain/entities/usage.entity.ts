import { randomUUID } from "node:crypto";

type UsageDriver = {
  id: string;
  name: string;
};

type UsageAutomobile = {
  id: string;
  plate: string;
  color: string;
  brand: string;
};

export type UsageObject = {
  id: string;
  data_inicio: string;
  data_termino: string | null;
  motivo_utilizacao: string;
  motorista: { id: string; nome: string };
  automovel: { id: string; placa: string; cor: string; marca: string };
};

export class Usage {
  private readonly id: string;
  private readonly startDate: string;
  private endDate: string | null;
  private readonly reason: string;
  private readonly driver: UsageDriver;
  private readonly automobile: UsageAutomobile;
  private wasSaved: boolean;

  constructor(
    id: string,
    startDate: string,
    endDate: string | null,
    reason: string,
    driver: UsageDriver,
    automobile: UsageAutomobile,
    wasSaved: boolean = false,
  ) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.reason = reason;
    this.driver = driver;
    this.automobile = automobile;
    this.wasSaved = wasSaved;
  }

  static create(
    reason: string,
    driver: UsageDriver,
    automobile: UsageAutomobile,
  ): Usage {
    return new Usage(
      randomUUID(),
      new Date().toISOString(),
      null,
      reason,
      driver,
      automobile,
      false,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getStartDate(): string {
    return this.startDate;
  }

  public getEndDate(): string | null {
    return this.endDate;
  }

  public getReason(): string {
    return this.reason;
  }

  public getDriver(): UsageDriver {
    return this.driver;
  }

  public getAutomobile(): UsageAutomobile {
    return this.automobile;
  }

  public isActive(): boolean {
    return this.endDate === null;
  }

  public finish(): void {
    this.endDate = new Date().toISOString();
  }

  public toObject(): UsageObject {
    return {
      id: this.id,
      data_inicio: this.startDate,
      data_termino: this.endDate,
      motivo_utilizacao: this.reason,
      motorista: {
        id: this.driver.id,
        nome: this.driver.name,
      },
      automovel: {
        id: this.automobile.id,
        placa: this.automobile.plate,
        cor: this.automobile.color,
        marca: this.automobile.brand,
      },
    };
  }

  public isSaved(): boolean {
    return this.wasSaved;
  }

  public markHasSaved(): void {
    this.wasSaved = true;
  }
}
