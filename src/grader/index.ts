import { getPyodide } from "./pyodideLoader";

let grader: Grader | null = null;

class Grader {
  /**
   * Initializes the grader by loading the Pyodide environment and the grading logic script.
   *
   * @throws {Error} If Pyodide fails to load or the grading logic script fails to run.
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async init(): Promise<void> {
    const pyodide = await getPyodide().catch((err) => {
      throw new Error(`Failed to load Pyodide: ${err.message}`);
    });
    const script = await fetch("./python/grading_logic.py")
      .then((response) => response.text())
      .catch((err) => {
        throw new Error(`Failed to fetch grading logic script: ${err.message}`);
      });
    await pyodide.runPythonAsync(script).catch((err) => {
      throw new Error(`Failed to run grading logic script: ${err.message}`);
    });
  }

  /**
   * Grades the provided CSV files using the grading logic defined in the Pyodide environment.
   *
   * @param {string[]} csvFiles - An array of CSV file contents as strings to be graded.
   * @param {string[]} studentNames - An array of student names corresponding to the CSV files.
   * @param {number} completionThreshold - The threshold for video completion percentage.
   * @param {number} forgivenessDegree - The degree of forgiveness applied to the grading.
   * @returns {Promise<GradingData>} A promise that resolves to the grading result object.
   * @throws {Error} If grading fails or returns an invalid result.
   */
  async gradeAsync(data: AssignmentData | null): Promise<GradingData | null> {
    if (!data) {
      return null;
    }
    const pyodide = await getPyodide();
    pyodide.globals.set("csv_files", data.csvTexts);
    pyodide.globals.set("student_names", data.studentNames);
    pyodide.globals.set("completion_threshold", data.completionThreshold);
    pyodide.globals.set("forgiveness_degree", data.forgivenessDegree);

    await pyodide.runPythonAsync(`result = grade(csv_files, student_names, completion_threshold, forgiveness_degree)`);

    const result = pyodide.globals.get("result");
    if (!result) {
      throw new Error("Grading logic did not return a result.");
    }

    return result;
  }
}

export async function loadGrader(): Promise<GraderInterface> {
  if (!grader) {
    grader = new Grader();
    await grader.init();
  }
  return grader;
}

export interface GraderInterface {
  init(): Promise<void>;
  gradeAsync(data: AssignmentData | null): Promise<GradingData | null>;
}
