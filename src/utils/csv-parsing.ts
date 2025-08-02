export function getCsvLines(input: string): string[] {
  if (!input) {
    return [];
  }
  return input.split("\n").map((line) => line.trim());
}

export async function* streamCSVFileTexts(files: FileList | File[]): AsyncGenerator<string> {
  for (const file of files as File[]) {
    yield new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const fileContent = event.target?.result as string;
        resolve(fileContent);
      };
      fileReader.onerror = () => {
        reject(new Error(`Error reading file: ${file.name}.`));
      };
      fileReader.readAsText(file);
    });
  }
}
