"use strict";

export function highlightErrorSourceInput(
  inputElement: HTMLInputElement | HTMLTextAreaElement | null,
  className: string = "error-highlight"
): void {
  if (!inputElement) {
    console.error("Input element is null or undefined.");
    return;
  }
  inputElement.classList.add(className);

  function removeHighlight() {
    if (!inputElement) {
      console.error("Input element is null or undefined.");
      return;
    }
    inputElement.classList.remove(className);
    inputElement.removeEventListener("click", removeHighlight);
  }

  inputElement.addEventListener("click", removeHighlight);
}

export class ErrorMessageList implements Iterable<string> {
  private _messages: string[];
  private _errorList: HTMLUListElement;
  private _liClass: string;

  constructor(
    ulClass: string = "error-list",
    liClass: string = "error-list-item"
  ) {
    this._messages = [];
    this._errorList = document.createElement("ul");
    this._errorList.className = ulClass;
    this._liClass = liClass;
  }

  push(message: string): boolean {
    this._messages.push(message);
    console.warn(`Error: ${message}`);
    const li = document.createElement("li");
    li.textContent = message;
    li.className = this._liClass;
    this._errorList.appendChild(li);
    return true;
  }

  pushIfNull(data: any | null, message: string): boolean {
    if (data === null) {
      return this.push(message);
    }
    return false;
  }

  get length(): number {
    return this._messages.length;
  }

  get(index: number): string | undefined {
    if (index < 0 || index >= this._messages.length) {
      console.warn(`Index ${index} is out of bounds for error messages.`);
      return undefined;
    }
    return this._messages[index];
  }

  get messages(): string[] {
    return this._messages;
  }

  clear(): string[] {
    const clearedMessages = [...this._messages];
    this._messages = [];
    this._errorList.innerHTML = "";
    return clearedMessages;
  }

  isEmpty(): boolean {
    return this._messages.length === 0;
  }

  [Symbol.iterator](): Iterator<string> {
    return this._messages[Symbol.iterator]();
  }

  createErrorBox(
    errorBoxId: string = "error-box",
    h4Class: string = "error-box-header",
    pClass: string = "error-box-paragraph"
  ): HTMLDivElement {
    if (this._messages.length === 0) {
      throw new Error("No error messages to display.");
    }

    const errorBox = document.createElement("div");
    errorBox.id = errorBoxId;

    const h4 = document.createElement("h4");
    h4.textContent = "Something went wrong...";
    h4.className = h4Class;
    errorBox.appendChild(h4);

    const p = document.createElement("p");
    p.className = pClass;
    p.textContent =
      this._messages.length === 1
        ? "The following error occurred:"
        : `The following ${this.length} errors occurred:`;
    errorBox.appendChild(p);

    errorBox.appendChild(this._errorList);

    return errorBox;
  }

  display(
    parentElement: HTMLElement,
    errorBoxId: string = "error-box",
    h4Class: string = "error-box-header",
    pClass: string = "error-box-paragraph"
  ): void {
    let errorBox: HTMLDivElement;
    try {
      errorBox = this.createErrorBox(errorBoxId, h4Class, pClass);
      if (errorBox) {
        parentElement.appendChild(errorBox);
      } else {
        console.error("Failed to create error box.");
      }
    } catch (error) {
      console.error("Error creating error box:", error);
    }
  }
}
