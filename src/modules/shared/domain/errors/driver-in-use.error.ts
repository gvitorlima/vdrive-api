export class DriverInUseError extends Error {
  constructor(driverId: string) {
    super(`Driver with id "${driverId}" is already using an automobile`);
    this.name = "DriverInUseError";
  }
}
