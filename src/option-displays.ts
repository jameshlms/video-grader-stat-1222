"use strict";

/**
 *  Displays the appropriate input fields for names based on the selected source.
 *
 * @param namesSource
 * @returns true if the display was updated successfully, false otherwise.
 */
export function displaySelectedNamesInput(
  namesSource: number,
  selectors: string[]
): boolean {
  if (!Array.isArray(selectors) || selectors.length === 0) {
    console.error("Invalid selectors array provided");
    return false;
  }

  

  const namesTextarea = document.getElementById("names-textarea");
  const namesFile = document.getElementById("names-file");
  const saveNamesOption = document.getElementById("save-names-option");
  if (!namesTextarea || !namesFile || !saveNamesOption) {
    console.error("Names input elements not found");
    return false;
  }
  switch (namesSource) {
    case 0:
      namesTextarea.classList.add("hidden");
      namesFile.classList.add("hidden");
      saveNamesOption.classList.add("hidden");
      break;
    case 1:
      namesTextarea.classList.remove("hidden");
      namesFile.classList.add("hidden");
      saveNamesOption.classList.remove("hidden");
      break;
    case 2:
      namesTextarea.classList.add("hidden");
      namesFile.classList.remove("hidden");
      saveNamesOption.classList.remove("hidden");
      break;
    default:
      console.error("Invalid names source selected:", namesSource);
      namesTextarea.classList.add("hidden");
      namesFile.classList.add("hidden");
      saveNamesOption.classList.add("hidden");
      return false;
  }
  return true;
}

/**
 * Displays the passkey input field based on the checkbox state.
 *
 * @param checked - true to show the passkey input, false to hide it.
 *  @returns true if the display was updated successfully, false otherwise.
 */
export function displayPasskeyInput(checked: boolean): boolean {
  const passkeyInput = document.getElementById("passkey-input");
  if (!passkeyInput) {
    console.error("Passkey input element not found");
    return false;
  }
  if (checked) {
    passkeyInput.classList.remove("hidden");
  } else {
    passkeyInput.classList.add("hidden");
  }
  return true;
}
