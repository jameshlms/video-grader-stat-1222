"use strict";
Array.prototype.first = function () {
    return this.length > 0 ? this[0] : null;
};
const dataTransformations = {
    name: (value) => String(value),
    completed: (value) => (value ? "Completed" : "Incompleted"),
    ignoredMissingVideos: (value) => String(value),
};
/**
 * Creates a table from a JSON string representing grading data.
 * The JSON string should be in the format:
 * {
 *   "count": <number of students>,
 *   "data": {
 *     "name": ["Student1", "Student2", ...],
 *     "completed": [true, false, ...],
 *     "ignoredMissingVideos": [0, 1, ...],
 *     "video1Completion": [0.95, 0.85, ...],
 *     ...
 *   }
 * }
 *
 * @param jsonString - The JSON string containing grading data.
 * @returns true if the table was created successfully, false otherwise.
 */
export function createTableFromJSON(obj) {
    const table = document.createElement("table");
    const jsonData = typeof obj === "string" ? JSON.parse(obj) : obj;
    const tableRowCount = jsonData.count + 1;
    const data = jsonData.data;
    const tableHead = document.createElement("thead");
    table.appendChild(tableHead);
    const tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    const fragment = document.createDocumentFragment();
    const tableRowsArray = new Array(tableRowCount);
    tableRowsArray[0] = document.createElement("tr");
    tableHead.appendChild(tableRowsArray[0]);
    for (let i = 1; i < tableRowCount; i++) {
        const row = document.createElement("tr");
        tableRowsArray[i] = row;
        fragment.appendChild(row);
    }
    tableBody.appendChild(fragment);
    for (const [header, values] of Object.entries(data)) {
        const th = document.createElement("th");
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
                    return null;
                }
                th.textContent = `Video ${match[1]} Completion Rate`;
                break;
        }
        const headerRow = tableRowsArray.first();
        if (!headerRow) {
            console.error("No table rows found to insert header cell.");
            return null;
        }
        headerRow.appendChild(th);
        for (let i = 1; i < tableRowCount; i++) {
            const value = values[i - 1];
            const tableData = document.createElement("td");
            tableRowsArray[i].appendChild(tableData);
            tableData.parentElement?.classList.add(i % 2 === 0 ? "even-row" : "odd-row", header === "completed" && value ? "completed" : "incompleted");
            const transform = dataTransformations[header];
            tableData.textContent = transform
                ? transform(value)
                : typeof value === "number"
                    ? (value * 100).toFixed(0) + "%"
                    : String(value);
        }
    }
    return table;
}
