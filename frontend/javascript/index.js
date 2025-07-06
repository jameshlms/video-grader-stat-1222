"use strict";

import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs";
import { pythonCode } from "./python-snippet.js";
import { appendTableFromJson } from "./table-output.js";
import {
  displaySelectedNamesInput,
  displayPasskeyInput,
} from "./option-displays.js";
import {
  convertStatisticsFilesInput,
  convertForgivenessDegreeInput,
  convertThresholdInput,
} from "./input-handlers.js";
import {
  ErrorMessageList,
  highlightErrorSourceInput,
} from "./error-display.js";
import { getGradingLogic } from "./python-code.js";

let pyodide;
const errorMessages = new ErrorMessageList();

async function loadResources() {
  pyodide = await loadPyodide();
  await pyodide.loadPackage(["pandas"]);
  document.getElementById("loading-screen").style.display = "none";
}

function unhidePageContent() {
  document.querySelector("header").classList.remove("hidden");
  document.querySelector("main").classList.remove("hidden");
  document.querySelector("footer").classList.remove("hidden");
}

async function main() {
  await loadResources();
  unhidePageContent();

  const gradingLogic = await getGradingLogic();
  if (gradingLogic) {
    console.log(gradingLogic);
  } else {
    console.error("Failed to load grading logic.");
  }

  document
    .querySelectorAll('input[name="name-source"]')
    .forEach((radioButton) => {
      radioButton.addEventListener("change", (event) => {
        const namesSource = parseInt(event.target.value);
        displaySelectedNamesInput(namesSource);
      });
    });

  document
    .getElementById("save-names-checkbox")
    .addEventListener("change", (event) => {
      displayPasskeyInput(event.target.checked);
    });

  document
    .getElementById("clear-selection-button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById("video-file").value = "";
      document.getElementById("video-file").files = null;
    });

  document
    .getElementById("submit-button")
    .addEventListener("click", (event) => {
      submitForm(event).then((success) => {
        if (success) {
          console.log("Form submitted successfully.");
        } else {
          console.error("Form submission failed.");
        }
      });
    });
}

async function submitForm(event) {
  event.preventDefault();

  let csvFiles;
  const fileInput = document.getElementById("video-file");
  convertCsvFiles(fileInput.files)
    .then((files) => {
      csvFiles = files;
    })
    .catch((error) => {
      let message = "An error occurred while processing the CSV files.";
      switch (error.name) {
        case "ParsingError":
          message = `Something went wrong, refresh the page and try again. (${error.name}: ${error.message})`;
          break;
        case "InvalidFileTypeError":
          message = `Please upload valid CSV files. (${error.name}: ${error.message})`;
          break;
        default:
          message = `No CSV files were uploaded. (${error.name}: ${error.message})`;
      }
      errorMessages.push(message);
      highlightErrorSourceInput(fileInput);
    });

  const thresholdInput = document.getElementById("completion-threshold-input");
  let threshold;
  convertThresholdInput(thresholdInput.value)
    .then((thresholdValue) => {
      threshold = thresholdValue;
    })
    .catch((error) => {
      errorMessages.push(
        `Invalid threshold value. The value must be between 0 and 1 or a percentage. (${error.name}: ${error.message})`
      );
      highlightErrorSourceInput(thresholdInput);
    });

  const forgivenessInput = document.getElementById("forgiveness-degree-input");
  let forgiveness;
  convertForgivenessDegreeInput(forgivenessInput.value)
    .then((forgivenessValue) => {
      forgiveness = forgivenessValue;
    })
    .catch((error) => {
      errorMessages.push(
        `Invalid forgiveness value. The value must be between 0 and 5. (${error.name}: ${error.message})`
      );
      highlightErrorSourceInput(forgivenessInput);
    });

  if (!errorMessages.isEmpty()) {
    const errorBox = errorMessages.createErrorBox();
    document.querySelector("main").appendChild(errorBox);
    return false;
  }

  // Clear previous information
  document.querySelector("form").reset();
  errorMessages.clear();
  return true;
}

main();
