/**
 * Request Validation Middleware
 * Provides request body and parameter validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateEmail, validateText, validateNumber, ValidationResult } from '@/lib/utils/validation';
import { ErrorHandler } from '@/lib/utils/error-handler';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'uuid' | 'url';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: unknown) => ValidationResult;
}

/**
 * Validate request body against rules
 */
export function validateRequestBody(
  body: Record<string, unknown>,
  rules: ValidationRule[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const rule of rules) {
    const value = body[rule.field];

    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rule.field} is required`);
      continue;
    }

    // Skip validation if field is not required and not present
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${rule.field} must be a string`);
            continue;
          }
          const textValidation = validateText(value as string, {
            minLength: rule.minLength,
            maxLength: rule.maxLength,
            required: rule.required,
            fieldName: rule.field,
          });
          if (!textValidation.valid) {
            errors.push(textValidation.error || `${rule.field} is invalid`);
          }
          break;

        case 'email':
          if (typeof value !== 'string') {
            errors.push(`${rule.field} must be a string`);
            continue;
          }
          const emailValidation = validateEmail(value as string);
          if (!emailValidation.valid) {
            errors.push(emailValidation.error || `${rule.field} is invalid`);
          }
          break;

        case 'number':
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          const numValidation = validateNumber(numValue, {
            min: rule.min,
            max: rule.max,
            required: rule.required,
            fieldName: rule.field,
          });
          if (!numValidation.valid) {
            errors.push(numValidation.error || `${rule.field} is invalid`);
          }
          break;

        case 'uuid':
          if (typeof value !== 'string') {
            errors.push(`${rule.field} must be a string`);
            continue;
          }
          // UUID validation would go here
          break;

        case 'url':
          if (typeof value !== 'string') {
            errors.push(`${rule.field} must be a string`);
            continue;
          }
          // URL validation would go here
          break;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (!customResult.valid) {
        errors.push(customResult.error || `${rule.field} is invalid`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validation middleware wrapper
 */
export function withValidation(
  handler: (request: NextRequest, body: Record<string, unknown>) => Promise<NextResponse>,
  rules: ValidationRule[]
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Parse request body
      let body: Record<string, unknown> = {};
      try {
        body = await request.json();
      } catch (error) {
        return NextResponse.json(
          ErrorHandler.createError('Invalid JSON in request body', 'INVALID_JSON', undefined, 400),
          { status: 400 }
        );
      }

      // Validate body
      const validation = validateRequestBody(body, rules);
      if (!validation.valid) {
        return NextResponse.json(
          ErrorHandler.createError(
            `Validation failed: ${validation.errors.join(', ')}`,
            'VALIDATION_ERROR',
            { errors: validation.errors },
            400
          ),
          { status: 400 }
        );
      }

      // Call handler with validated body
      return await handler(request, body);
    } catch (error) {
      ErrorHandler.logError(error, 'withValidation');
      const appError = ErrorHandler.handleFetchError(error, 'API');
      return NextResponse.json(appError, { status: appError.statusCode || 500 });
    }
  };
}
