import * as Constants from "./constants";

export enum ScreenId {
  Loading = Constants.LOADING_SCREEN_ID,
  MainContent = Constants.MAIN_CONTENT_SCREEN_ID,
  ServiceDown = Constants.SERVICE_DOWN_SCREEN_ID,
}

function toggleVisibility(elementId: ScreenId, isVisible: boolean): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.toggle("hidden", !isVisible);
  }
}

export function showScreen(
  currentState: ScreenId,
  options?: {
    supplementalFunction?: (...args: any[]) => void;
  }
): void {
  options?.supplementalFunction?.();

  Object.values(ScreenId).forEach((id) => {
    toggleVisibility(id, id === currentState);
  });
}
