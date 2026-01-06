/**
 * Input Validation Utilities
 * Provides type-safe validation functions for common input types
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }

  if (email.length > 255) {
    return { valid: false, error: 'Email is too long (max 255 characters)' }
  }

  return { valid: true }
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' }
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' }
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long (max 128 characters)' }
  }

  // Optional: Add more complex validation
  // const hasUpperCase = /[A-Z]/.test(password)
  // const hasLowerCase = /[a-z]/.test(password)
  // const hasNumber = /\d/.test(password)
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return { valid: true }
}

/**
 * Text input validation
 */
export function validateText(
  text: string,
  options?: {
    minLength?: number
    maxLength?: number
    required?: boolean
    fieldName?: string
  }
): ValidationResult {
  const {
    minLength = 0,
    maxLength = Infinity,
    required = false,
    fieldName = 'Field',
  } = options || {}

  if (required && (!text || text.trim().length === 0)) {
    return { valid: false, error: `${fieldName} is required` }
  }

  if (text && text.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    }
  }

  if (text && text.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    }
  }

  return { valid: true }
}

/**
 * URL validation
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL is required' }
  }

  try {
    new URL(url)
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

/**
 * Number validation
 */
export function validateNumber(
  value: number | string,
  options?: {
    min?: number
    max?: number
    required?: boolean
    fieldName?: string
  }
): ValidationResult {
  const {
    min = -Infinity,
    max = Infinity,
    required = false,
    fieldName = 'Number',
  } = options || {}

  if (required && (value === null || value === undefined || value === '')) {
    return { valid: false, error: `${fieldName} is required` }
  }

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a valid number` }
  }

  if (num < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` }
  }

  if (num > max) {
    return { valid: false, error: `${fieldName} must be no more than ${max}` }
  }

  return { valid: true }
}

/**
 * UUID validation
 */
export function validateUuid(uuid: string): ValidationResult {
  if (!uuid || uuid.trim().length === 0) {
    return { valid: false, error: 'UUID is required' }
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(uuid)) {
    return { valid: false, error: 'Invalid UUID format' }
  }

  return { valid: true }
}

/**
 * Combined validation (all must pass)
 */
export function validateAll(
  validations: ValidationResult[]
): ValidationResult {
  for (const validation of validations) {
    if (!validation.valid) {
      return validation
    }
  }
  return { valid: true }
}
