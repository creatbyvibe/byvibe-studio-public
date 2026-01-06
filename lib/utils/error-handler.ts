/**
 * Unified Error Handling Utilities
 * Replaces alert() and console.error() with structured error handling
 */

export interface AppError {
  message: string
  code?: string
  details?: unknown
  statusCode?: number
}

export class ErrorHandler {
  /**
   * Log error to console (development only)
   */
  static logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      const prefix = context ? `[${context}]` : '[Error]'
      console.error(prefix, error)
    }
  }

  /**
   * Extract error message from various error types
   */
  static extractMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>
      if (err.message && typeof err.message === 'string') {
        return err.message
      }
      if (err.error && typeof err.error === 'string') {
        return err.error
      }
    }
    return 'An unexpected error occurred'
  }

  /**
   * Create a structured error object
   */
  static createError(
    message: string,
    code?: string,
    details?: unknown,
    statusCode?: number
  ): AppError {
    return {
      message,
      code,
      details,
      statusCode,
    }
  }

  /**
   * Handle API errors and return user-friendly message
   */
  static handleApiError(response: Response, data?: unknown): AppError {
    const statusCode = response.status
    let message = 'An error occurred'
    let code: string | undefined

    if (data && typeof data === 'object' && data !== null) {
      const err = data as Record<string, unknown>
      message = (err.error as string) || (err.message as string) || message
      code = (err.code as string) || code
    }

    // Map common status codes to user-friendly messages
    switch (statusCode) {
      case 400:
        message = message || 'Invalid request. Please check your input.'
        break
      case 401:
        message = message || 'Authentication required. Please sign in.'
        break
      case 403:
        message = message || 'You do not have permission to perform this action.'
        break
      case 404:
        message = message || 'The requested resource was not found.'
        break
      case 429:
        message = message || 'Rate limit exceeded. Please try again later.'
        code = code || 'RATE_LIMIT_EXCEEDED'
        break
      case 500:
        message = message || 'Server error. Please try again later.'
        break
      case 503:
        message = message || 'Service temporarily unavailable. Please try again later.'
        break
    }

    return this.createError(message, code, data, statusCode)
  }

  /**
   * Handle fetch errors
   */
  static handleFetchError(error: unknown, context?: string): AppError {
    this.logError(error, context)

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return this.createError(
        'Network error. Please check your connection and try again.',
        'NETWORK_ERROR'
      )
    }

    return this.createError(
      this.extractMessage(error),
      'UNKNOWN_ERROR'
    )
  }
}

/**
 * React hook for error state management
 */
export function useErrorHandler() {
  const handleError = (error: unknown, context?: string): AppError => {
    ErrorHandler.logError(error, context)
    return ErrorHandler.createError(ErrorHandler.extractMessage(error))
  }

  return { handleError }
}
