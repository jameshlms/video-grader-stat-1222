import { VIDEO_STATISTICS_HEADER, NAME_INDEX, COMPLETION_RATE_INDEX } from "../constants";
import { getCsvLines } from "../utils/csv-parsing";
import { ValidationResult } from "./validation-result";

export function isValidVideoStatistics(input: string): ValidationResult {
  const validationResult = new ValidationResult(true);

  const lines = getCsvLines(input);
  if (lines.length < 2) {
    return validationResult
      .setValid(false)
      .setErrorMessage("File must contain at least one video statistics entry and a valid header.");
  }
  const header = lines[0];
  if (header !== VIDEO_STATISTICS_HEADER) {
    return validationResult
      .setValid(false)
      .setErrorMessage(`Invalid header format. Expected "${VIDEO_STATISTICS_HEADER}", but got "${header}".`);
  }
  const invalidLines = lines.slice(1).filter((line) => {
    const parts = line.split(",");
    return (
      parts.length !== 4 ||
      parts[NAME_INDEX].split(" ").length < 2 || // Ensure at least first and last name
      isNaN(parseFloat(parts[COMPLETION_RATE_INDEX].replace("%", "")))
    );
  });
  if (invalidLines.length > 0) {
    return validationResult
      .setValid(false)
      .setErrorMessage(
        `Invalid video statistics entries found: ${invalidLines.join(
          "; "
        )}. Ensure each entry has a valid name and completion rate.`
      );
  }
  return validationResult;
}

export function isValidNamesFile(input: string): ValidationResult {
  const validationResult = new ValidationResult(true);
  if (!input) {
    return validationResult.setValid(false).setErrorMessage("File must contain at least one name.");
  }

  const lines = getCsvLines(input);
  if (lines.length < 1) {
    return validationResult.setValid(false).setErrorMessage("File must contain at least one name.");
  }

  for (const line of lines) {
    const name = line.trim().toLowerCase();
    if (["name", "names"].includes(name)) {
      continue;
    }
    if (name.includes(",")) {
      return new ValidationResult(false, `Invalid name format: "${name}". Names should not contain commas.`);
    }
    if (name === "") {
      return new ValidationResult(false, "File must contain at least one valid name.");
    }
    if (name.split(" ").length < 2) {
      return new ValidationResult(
        false,
        `Invalid name format: "${name}". Names should contain at least a first and last name.`
      );
    }
  }
  return new ValidationResult(true);
}

export function isValidNamesTextarea(input: string): ValidationResult {
  const validationResult = new ValidationResult(true);
  const names = input
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter((name) => name !== "" && !["name", "names"].includes(name));

  if (names.length === 0) {
    return validationResult.setValid(false).setErrorMessage("Names not in a valid format");
  }
  return validationResult;
}

export function isValidNames(input: string): ValidationResult {
  const validationResult = new ValidationResult(true);
  if (!input) {
    return validationResult.setValid(false).setErrorMessage("No names provided from source.");
  }

  const names = input
    .trim()
    .split(/[\n,]/)
    .map((name) => name.trim())
    .filter((name) => !name && ["name", "names"].includes(name));

  if (names.length === 0) {
    return validationResult.setValid(false).setErrorMessage("File must contain at least one name");
  }

  return validationResult;
}

export function isValidForgiveness(value: string): ValidationResult {
  const isValid = /^[0-5]$/.test(value.trim());
  return new ValidationResult(
    isValid,
    isValid ? undefined : "Invalid forgiveness degree. Please enter a number between 0 and 5."
  );
}

export function isValidThreshold(value: string): ValidationResult {
  const isValid = /^(100|[1-9]?[0-9])%?$/.test(value.trim());
  return new ValidationResult(
    isValid,
    isValid ? undefined : "Invalid threshold input. Please enter a percentage between 0% and 100%."
  );
}

export function getVideoStatistics(input: string): string {
  return input.trim();
}

export function getNamesFile(input: string): string[] {
  const lines = input.split("\n").map((line) => line.trim().toLowerCase());
  return lines.filter((name) => name !== "" && !["name", "names"].includes(name) && !name.includes(","));
}

export function getNamesTextarea(input: string | null): string[] {
  if (!input) {
    return [];
  }
  const names = input
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter((name) => name !== "" && !["name", "names"].includes(name));
  return names;
}

export function getNames(input: string): string[] {
  if (!input) {
    return [];
  }
  return input
    .trim()
    .split(/[\n,]/)
    .map((name) => name.trim())
    .filter((name) => !name && ["name", "names"].includes(name));
}

export function getForgiveness(value: string): number {
  return Math.round(parseFloat(value.trim()));
}

export function getThreshold(value: string): number {
  const trimmedValue = value.trim().replace(/%/g, "");
  return parseInt(trimmedValue, 10) / 100;
}
