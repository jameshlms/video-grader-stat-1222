"use strict";

// CSS Classes and IDs
export const HIDDEN_CLASS = "hidden";
export const LOADING_SCREEN_ID = "loading-screen";
export const MAIN_SCREEN_ID = "main-content";
export const SERVICE_DOWN_SCREEN_ID = "service-down";
export const ERROR_HIGHLIGHT_CLASS = "error-highlight";
export const RESULTS_ID = "results";
export const ODD_ROW_CLASS = "odd-row";
export const EVEN_ROW_CLASS = "even-row";
export const COMPLETED_ROW_CLASS = "completed-row";
export const INCOMPLETED_ROW_CLASS = "incompleted-row";
export const SAVED_NAMES_ID = "save-names-checkbox";
export const NAMES_TEXTAREA_ID = "names-textarea";
export const NAMES_FILE_INPUT_ID = "names-file";
export const STATISTICS_FILES_ID = "statistics-files";
export const FORGIVENESS_DEGREE_ID = "forgiveness-degree";
export const COMPLETION_THRESHOLD_ID = "completion-threshold";
export const SUBMIT_BUTTON_ID = "submit-button";
export const LOADING_MESSAGE_CONTAINER_ID = "loading-message-container";
export const ERROR_MESSAGE_CONTAINER_ID = "error-message-container";
export const ASSIGNMENT_UPLOAD_ID = "assignment-upload";

// Input IDs for file and name sources
export enum NamesSource {
  savedNames = SAVED_NAMES_ID,
  namesTextarea = NAMES_TEXTAREA_ID,
  namesFile = NAMES_FILE_INPUT_ID,
}

// Misc.
export const VIDEO_STATISTICS_HEADER = "Name, Role, Email, Completion Rate";
export const NAME_INDEX = 0;
export const ROLE_INDEX = 1;
export const EMAIL_INDEX = 2;
export const COMPLETION_RATE_INDEX = 3;
export const SAVED_NAMES_VALUE = 0;
export const MANUAL_NAMES_VALUE = 1;
export const UPLOAD_NAMES_VALUE = 2;
