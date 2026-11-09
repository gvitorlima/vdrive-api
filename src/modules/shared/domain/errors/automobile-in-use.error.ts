export class AutomobileInUseError extends Error {
  constructor(automobileId: string) {
    super(`Automobile with id "${automobileId}" is already in use`);
    this.name = "AutomobileInUseError";
  }
}
