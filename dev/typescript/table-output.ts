"use strict";

declare global {
  interface Array<T> {
    first(): T | null;
  }
}

Array.prototype.first = function <T>(): T | null {
  return this.length > 0 ? this[0] : null;
};

type ColumnHeader = string;
type ColumnValues = string[] | number[] | boolean[];
type Column = Record<ColumnHeader, ColumnValues>;

type GradingData = {
  count: number;
  data: Record<string, string[] | number[] | boolean[]>;
};

const dataTransformations: Record<string, (value: any) => string> = {
  name: (value: any) => String(value),
  completed: (value: any) => (value ? "Completed" : "Incompleted"),
  ignoredMissingVideos: (value: any) => String(value),
};

/**
 * Creates a table from a JSON string representing grading data.
 *
 * @param jsonString - The JSON string containing grading data.
 * @returns true if the table was created successfully, false otherwise.
 */
export function appendTableFromJson(
  gradingData: GradingData | string,
  targetElement: HTMLElement
): void {
  // Create the table element
  const table: HTMLTableElement = document.createElement("table");

  // Either parse the JSON string or use the provided object directly
  const jsonData: GradingData =
    typeof gradingData === "string" ? JSON.parse(gradingData) : gradingData;

  // Number of rows in the table (including the header row) and grading data
  const tableRowCount: number = jsonData.count + 1;
  const data: Record<string, string[] | number[] | boolean[]> = jsonData.data;

  // Append the created head and body to the table
  const tableHead: HTMLTableSectionElement = document.createElement("thead");
  table.appendChild(tableHead);
  const tableBody: HTMLTableSectionElement = document.createElement("tbody");
  table.appendChild(tableBody);

  // Create a fragment to hold the table rows
  const fragment: DocumentFragment = document.createDocumentFragment();
  const tableRowsArray: HTMLTableRowElement[] = new Array(tableRowCount);

  // First row in the rows array is the header row which is appended to the head
  tableRowsArray[0] = document.createElement("tr");
  tableHead.appendChild(tableRowsArray[0]);

  // Create the remaining rows and append them to the fragment which is then appended to the body
  for (let i = 1; i < tableRowCount; i++) {
    const row: HTMLTableRowElement = document.createElement("tr");
    tableRowsArray[i] = row;
    fragment.appendChild(row);
  }
  tableBody.appendChild(fragment);

  // Iterate over the pairs of headers and value arrays in the grading data
  // Convert headers to user-friendly names and change the text content of the header cells
  // Iterate over each value in the value arrays and create a table data cell for each value
  // Apply the appropriate transformation to the value based on the header
  // Add the table data cell to the corresponding row
  for (const [header, values] of Object.entries(data)) {
    const th: HTMLTableCellElement = document.createElement("th");
    switch (header) {
      case "name":
        th.textContent = "Student Name";
        break;
      case "completed":
        th.textContent = "Assignment Status";
        break;
      case "ignoredMissingVideos":
        th.textContent = "Dropped Missing Videos";
        break;
      default:
        const match = header.match(/^video(\d+)Completion$/);
        if (match == null) {
          console.error(`Invalid header format: ${header}`);
          return;
        }
        th.textContent = `Video ${match[1]} Completion Rate`;
        break;
    }

    tableRowsArray[0].appendChild(th);

    for (let i = 1; i < tableRowCount; i++) {
      const value = values[i - 1];

      const tableData: HTMLTableCellElement = document.createElement("td");
      tableRowsArray[i].appendChild(tableData);
      tableData.parentElement?.classList.add(
        i % 2 === 0 ? "even-row" : "odd-row",
        header === "completed" && value ? "completed" : "incompleted"
      );

      const transform = dataTransformations[header];

      tableData.textContent = transform
        ? transform(value)
        : typeof value === "number"
        ? (value * 100).toFixed(0) + "%"
        : String(value);
    }
  }
}
