import { loadPyodide, PyodideInterface } from "pyodide";

let pyodide: PyodideInterface | null = null;

export async function getPyodide(): Promise<PyodideInterface> {
  if (!pyodide) {
    pyodide = await loadPyodide({
      fullStdLib: true,
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
      packages: ["pandas", "numpy"],
    });
  }
  return pyodide;
}
