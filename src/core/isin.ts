export type IsinID = string

export enum ValidationErrorReason {
  WRONG_LENGTH = "WRONG_LENGTH",
  INVALID_FORMAT = "INVALID_FORMAT",
  ALREADY_SUBSCRIBED = "ALREADY_SUBSCRIBED",
}

export type ValidationError = {
  reason: ValidationErrorReason;
};

const ISIN_REGEX = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/

export function validateIsin(isin: IsinID): ValidationError | null {
  if (isin.length < 12 || isin.length > 12) {
    return { reason: ValidationErrorReason.WRONG_LENGTH }
  }

  if (!ISIN_REGEX.test(isin)) {
    return { reason: ValidationErrorReason.INVALID_FORMAT }
  }

  return null
}
