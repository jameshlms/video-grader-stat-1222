"use strict";

import { GraderInterface, loadGrader } from "./grader";
import { streamCSVFileTexts } from "./utils/csv-parsing";
import { ScreenId, showScreen } from "./screen-handler";
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

function handleError(message?: string): void {
  showScreen(ScreenId.ServiceDown);
  const errorMessageContainer = document.getElementById(Constants.ERROR_MESSAGE_CONTAINER_ID);
  if (errorMessageContainer) {
    errorMessageContainer.innerHTML = `${
      message ? `<p>${message}</p>` : ""
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

async function getResults(): Promise<void | GradingData> {
  const assignmentData = new FormData(document.getElementById(Constants.ASSIGNMENT_UPLOAD_ID) as HTMLFormElement);

  const csvFileTexts: string[] = [];

  const csvFilesFromInput = assignmentData.getAll("video-files") as File[];
  for await (const fileText of streamCSVFileTexts(csvFilesFromInput)) {
    if (!isValidVideoStatistics(fileText)) {
      return;
    }

    csvFileTexts.push(getVideoStatistics(fileText));
  }

  const studentNames: string[] = [];

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
      return;
  }

  if (!isValidNames(studentNamesFromSource)) {
    return;
  }
  studentNames.push(...getNames(studentNamesFromSource));

  const forgivenessFromInput = assignmentData.get("forgiveness-degree") as string;
  if (!isValidForgiveness(forgivenessFromInput)) {
    return;
  }
  const forgivenessDegree = getForgiveness(forgivenessFromInput);

  const thresholdFromInput = assignmentData.get("completion-threshold") as string;
  if (!isValidThreshold(thresholdFromInput)) {
    return;
  }
  const completionThreshold = getThreshold(thresholdFromInput);

  return await grader.gradeAsync(csvFileTexts, studentNames, completionThreshold, forgivenessDegree);
}

async function main(): Promise<void> {
  showScreen(ScreenId.Loading);

  loadGrader().then((graderInstance) => {
    if (!graderInstance) {
      return handleError("Failed to load grader instance.");
    }
    grader = graderInstance;
  });

  const submitButton = document.getElementById(Constants.SUBMIT_BUTTON_ID) as HTMLButtonElement;
  if (!submitButton) {
    return handleError("Could not load the submit button.");
  }
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    const results = getResults();
    results.then((gradeResult) => {
      if (gradeResult) {
        getTableFromGradingData(gradeResult);
      }
    });
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
  showScreen(ScreenId.MainContent);
}

window.onload = () => {
  main().catch((err) => {
    showScreen(ScreenId.ServiceDown);
    const errorMessageContainer = document.getElementById(Constants.ERROR_MESSAGE_CONTAINER_ID);
    if (errorMessageContainer) {
      errorMessageContainer.innerHTML = `<p>An error occurred: ${err.message}</p><p>Please try again later or use the contact below for support.</p>`;
    }
  });
};
