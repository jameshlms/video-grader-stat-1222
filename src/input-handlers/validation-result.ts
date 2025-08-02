export class ValidationResult {
  valid: boolean;
  errorMessage?: string;

  constructor(valid: boolean = true, errorMessage?: string) {
    this.valid = valid;
    this.errorMessage = errorMessage;
  }

  valueOf(): boolean {
    return this.valid;
  }

  setValid(valid?: boolean): this {
    if (valid !== undefined) {
      this.valid = valid;
    } else {
      this.valid = true;
    }
    return this;
  }

  isValid(): boolean {
    return this.valid;
  }

  setErrorMessage(message: string): this {
    this.errorMessage = message;
    return this;
  }

  getErrorMessage(): string | undefined {
    return this.errorMessage;
  }
}
