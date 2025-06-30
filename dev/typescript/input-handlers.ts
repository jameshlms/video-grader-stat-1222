"use-strict";

import { ParsingError, InvalidFileTypeError } from "./errors.js";

export async function convertStatisticsFilesInput(
  input: FileList
): Promise<Array<string>> {
  if (!input || input.length === 0) throw new Error("No file input provided.");
  if (!(input instanceof FileList)) throw new Error("Input is not a FileList.");

  const csvTextArray: Array<string> = [];

  Array.from(input).forEach((file) => {
    if (file.name.toLowerCase().endsWith(".csv")) {
      file
        .text()
        .then((text) => {
          csvTextArray.push(text);
        })
        .catch(() => {
          throw new ParsingError(`Error reading file: ${file.name}`);
        });
    } else {
      throw new InvalidFileTypeError(
        `Invalid file type: ${file.name}. Expected a CSV file.`
      );
    }
  });

  return csvTextArray;
}

export async function convertNamesFileInput(
  input: FileList
): Promise<Array<string> | null> {
  if (!input || input.length === 0) {
    throw new Error("No file input provided.");
  }

  const file = input[0];
  const fileType = file.type.toLowerCase();

  if (!["text/csv", "text/plain"].includes(fileType)) {
    throw new InvalidFileTypeError(
      `Invalid file type: ${file.name}. Expected a CSV or TXT file.`
    );
  }

  let names: string[] = [];

  file
    .text()
    .then((fileText) => {
      names = fileText
        .split(fileType === "text/csv" ? /\r?\n/ : ",")
        .map((line) => line.trim().toLowerCase())
        .filter((line) => !["name", "names"].includes(line));

      names.forEach((name) => {
        if ("," in Array.from(name)) {
          throw new ParsingError(`Invalid name format in file: ${file.name}`);
        }
      });
    })
    .catch((error) => {
      switch (error.name) {
        case "NotReadableError":
          throw new DOMException("File could not be read.", "NotReadableError");
        case "AbortError":
          throw new DOMException("File reading was aborted.", "AbortError");
        default:
          throw error;
      }
    });

  if (!names || names.length === 0) {
    throw new Error("No valid names found in the file.");
  }

  return names;
}

export function convertNamesTextInput(input: string | null): string | null {
  if (!input || input.trim() === "") {
    console.error("Names input cannot be empty.");
    return null;
  }

  const names = input
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter((name) => name !== "" && !["name", "names"].includes(name));

  if (names.length === 0) {
    console.error("No valid names provided.");
    return null;
  }

  return names.join(",");
}

export function validatePasskeyInput(input: string): string | null {
  if (!input || input.trim() === "") {
    console.error("Passkey input cannot be empty.");
    return null;
  }
  return input.trim();
}

export function convertForgivenessDegreeInput(
  input: string,
  defaultValue: number = 0
): number {
  if (!input) {
    return defaultValue;
  }
  const parsedValue = parseFloat(input);
  if (isNaN(parsedValue)) {
    throw new Error("Invalid forgiveness degree value.");
  }
  if (parsedValue < 0 || parsedValue > 5) {
    throw new Error("Forgiveness degree must be between 0 and 5.");
  }
  return parsedValue;
}

export function convertThresholdInput(
  input: string,
  defaultValue: number = 0.8
): number {
  if (!input) {
    return defaultValue;
  }
  const percentFormat = input.trim().endsWith("%");
  if (percentFormat) {
    input = input.slice(0, -1);
  }
  const parsedValue = parseFloat(input);
  if (isNaN(parsedValue)) {
    throw new Error("Invalid threshold value.");
  }
  if (percentFormat && parsedValue >= 0 && parsedValue <= 100) {
    return parsedValue / 100;
  }
  if (!percentFormat && parsedValue >= 0 && parsedValue <= 1) {
    return parsedValue;
  }
  throw new Error("Threshold must be between 0 and 1 or 0% and 100%.");
}
