"use strict";

import { GraderInterface, loadGrader } from "./grader";
import { streamCSVFileTexts } from "./utils/csv-parsing";
import { loadScreenManager, ScreenID, ScreenManagerInterface } from "./components/screen-manager";
import { getTableFromGradingData } from "./table-output";
import * as Constants from "./constants";
import {
  getForgiveness,
  getThreshold,
  getVideoStatistics,
  getNamesTextarea,
  getNamesFile,
  getNames,
  isValidForgiveness,
  isValidThreshold,
  isValidVideoStatistics,
  isValidNamesTextarea,
  isValidNamesFile,
  isValidNames,
} from "./input-handlers";

let grader: GraderInterface;
let screenManager: ScreenManagerInterface;

function handleError(error: Error | string): void {
  const message = typeof error === "string" ? error : error.message;
  screenManager.setCurrentScreen(ScreenID.ServiceDown);
  const errorMessageContainer = document.getElementById(Constants.ERROR_MESSAGE_CONTAINER_ID);
  if (errorMessageContainer) {
    errorMessageContainer.innerHTML = `${
      message ? `<p>An error occurred: ${message}</p>` : ""
    }<p>Please try again later or use the contact below for support.</p>`;
  }
}

function addFileInputChangeListener() {
  document.querySelectorAll("input[type='file']").forEach((input) => {
    input.addEventListener("change", (event) => {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        fileInput.classList.add("has-files");
      } else {
        fileInput.classList.remove("has-files");
      }
    });
  });
}

function getFormData(formId: string): FormData | null {
  const formElement = document.getElementById(formId) as HTMLFormElement;
  if (!formElement) {
    handleError(`Form with ID ${formId} not found.`);
    return null;
  }
  return new FormData(formElement);
}

async function getAssignmentData(): Promise<null | AssignmentData> {
  const assignmentData = getFormData(Constants.ASSIGNMENT_UPLOAD_ID);
  if (!assignmentData) return null;

  const result: AssignmentData = {
    csvTexts: [],
    studentNames: [],
    completionThreshold: 0,
    forgivenessDegree: 0,
  };

  const csvFilesFromInput = assignmentData.getAll("video-files") as File[];
  for await (const fileText of streamCSVFileTexts(csvFilesFromInput)) {
    if (!isValidVideoStatistics(fileText)) {
      return null;
    }

    result.csvTexts.push(getVideoStatistics(fileText));
  }

  const studentNamesSourceRadio = assignmentData.get("names-source") as string;
  const studentNamesFromSource = "";
  switch (parseInt(studentNamesSourceRadio)) {
    case Constants.SAVED_NAMES_VALUE:
      alert("Not yet implemented");
      break;
    case Constants.MANUAL_NAMES_VALUE:
      studentNamesFromSource.concat(assignmentData.get("manual-names") as string);
      break;
    case Constants.UPLOAD_NAMES_VALUE:
      studentNamesFromSource.concat(await (assignmentData.get("file-names") as File).text());
      break;
    default:
      return null;
  }

  if (!isValidNames(studentNamesFromSource)) {
    return null;
  }
  result.studentNames.push(...getNames(studentNamesFromSource));

  const forgivenessFromInput = assignmentData.get("forgiveness-degree") as string;
  if (!isValidForgiveness(forgivenessFromInput)) {
    return null;
  }
  result.forgivenessDegree = getForgiveness(forgivenessFromInput);

  const thresholdFromInput = assignmentData.get("completion-threshold") as string;
  if (!isValidThreshold(thresholdFromInput)) {
    return null;
  }
  result.completionThreshold = getThreshold(thresholdFromInput);

  return result;
}

async function main(args?: string[]): Promise<void> {
  console.log(`function "main" started`);
  screenManager = loadScreenManager([ScreenID.Main, ScreenID.ServiceDown, ScreenID.Loading], Constants.HIDDEN_CLASS);
  screenManager.setCurrentScreen(ScreenID.Loading);

  grader = await loadGrader();
  console.log(`grader loaded`);

  const submitButton = document.getElementById(Constants.SUBMIT_BUTTON_ID) as HTMLButtonElement;
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const assignmentData = await getAssignmentData();
    const gradingResult = await grader.gradeAsync(assignmentData);

    if (!gradingResult) return handleError("Grading failed. Please try again.");

    const table = getTableFromGradingData(gradingResult);
  });

  document.getElementById("clear-selection-button")?.addEventListener("click", (event) => {
    event.preventDefault();
    const videoFileInput = document.getElementById(Constants.STATISTICS_FILES_ID) as HTMLInputElement;
    if (videoFileInput) {
      videoFileInput.value = "";
      videoFileInput.files = null;
    }
  });

  addFileInputChangeListener();
  screenManager.setCurrentScreen(ScreenID.Main);
}

window.onload = () => {
  main().catch((err) => {
    handleError(err);
  });
};
