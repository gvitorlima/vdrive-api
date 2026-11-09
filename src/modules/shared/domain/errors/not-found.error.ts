/**
 * Erro de domínio genérico para recursos não encontrados
 * A ideia é ser utilizado por qualquer módulo da aplicação
 */
export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" not found`);
    this.name = "NotFoundError";
  }
}
