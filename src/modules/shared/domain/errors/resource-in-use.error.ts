/**
 * Erro de domínio genérico para impedir deleção de recurso que está em uso ativo
 */
export class ResourceInUseError extends Error {
  constructor(resource: string, id: string) {
    super(
      `Cannot delete ${resource} with id "${id}" because it is currently in use`,
    );
    this.name = "ResourceInUseError";
  }
}
