export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParsingError";
  }
}

export class InvalidFileTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidFileTypeError";
  }
}
