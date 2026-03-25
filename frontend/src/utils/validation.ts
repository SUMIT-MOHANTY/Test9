/**
 * Type validation utilities to ensure runtime type safety
 */

type ValidationError = {
  field: string;
  message: string;
};

export function validateObject<T>(data: unknown, schema: Record<keyof T, (val: any) => boolean>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'root', message: 'Not a valid object' });
    return errors;
  }

  for (const [key, validator] of Object.entries(schema)) {
    try {
      // @ts-ignore - We're checking dynamically
      const value = (data as any)[key];
      if (!validator(value)) {
        errors.push({
          field: key,
          message: `Invalid value for field ${key}`
        });
      }
    } catch (e) {
      errors.push({
        field: key,
        message: `Validation error: ${(e as Error).message}`
      });
    }
  }

  return errors;
}

// Common validators
export const validators = {
  string: (val: any): boolean => typeof val === 'string',
  nonEmptyString: (val: any): boolean => typeof val === 'string' && val.trim() !== '',
  number: (val: any): boolean => typeof val === 'number' && !isNaN(val),
  positiveNumber: (val: any): boolean => typeof val === 'number' && !isNaN(val) && val > 0,
  boolean: (val: any): boolean => typeof val === 'boolean',
  array: (val: any): boolean => Array.isArray(val),
  nonEmptyArray: (val: any): boolean => Array.isArray(val) && val.length > 0,
  email: (val: any): boolean => typeof val === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  url: (val: any): boolean => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  date: (val: any): boolean => val instanceof Date && !isNaN(val.getTime()),
  object: (val: any): boolean => val !== null && typeof val === 'object' && !Array.isArray(val),
};

/**
 * Type guard to validate API response structure
 */
export function isValidApiResponse<T>(data: any, typeValidator: (val: any) => boolean): data is T {
  return data !== null && typeof data === 'object' && typeValidator(data);
}
