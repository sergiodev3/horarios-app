// Utility para logging que se puede controlar por ambiente
class Logger {
  private isDevelopment = import.meta.env.DEV;

  log(message: string, data?: unknown) {
    if (this.isDevelopment) {
      console.log(`[LOG] ${message}`, data);
    }
  }

  error(message: string, error?: unknown) {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    }
  }

  warn(message: string, data?: unknown) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  // Para información sensible, solo mostrar en desarrollo y sin el token completo
  logAuth(message: string, data?: { token?: string; [key: string]: unknown }) {
    if (this.isDevelopment) {
      const safeData = data ? {
        ...data,
        token: data.token ? `${data.token.substring(0, 20)}...` : undefined
      } : undefined;
      console.log(`[AUTH] ${message}`, safeData);
    }
  }
}

export const logger = new Logger();