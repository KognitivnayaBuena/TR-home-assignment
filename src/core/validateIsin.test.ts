import { describe, it, expect } from 'vitest';
import { ValidationErrorReason, validateIsin } from './isin';

describe('validateIsin', () => {
  it('should return null for a valid ISIN', () => {
    expect(validateIsin('US0378331005')).toBeNull();
  });

  it('should return WRONG_LENGTH for an ISIN with invalid length', () => {
    expect(validateIsin('US0378331')).toEqual({
      reason: ValidationErrorReason.WRONG_LENGTH
    });
  });

  it('should return INVALID_FORMAT for an ISIN with invalid country code', () => {
    expect(validateIsin('U10378331005')).toEqual({
      reason: ValidationErrorReason.INVALID_FORMAT
    });
  });

  it('should return INVALID_FORMAT for an ISIN with invalid check digit', () => {
    expect(validateIsin('US037833100A')).toEqual({
      reason: ValidationErrorReason.INVALID_FORMAT
    });
  });
});