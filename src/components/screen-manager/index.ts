import { ScreenID } from "./screensIDs";
export { ScreenID };

let screenManager: ScreenManager;

export function loadScreenManager(screens: string[], hiddenClassName: string): ScreenManager {
  if (!screenManager) {
    screenManager = new ScreenManager(screens, hiddenClassName);
  }
  return screenManager;
}

class ScreenManager {
  private _screens: string[];
  private _currentScreen: string;
  private _hiddenClassName: string;

  constructor(screens: string[], hiddenClassName: string) {
    this._currentScreen = screens[0];
    this._screens = [...screens];
    this._hiddenClassName = hiddenClassName;
    this._screens.forEach((screenId) => {
      const screenElement = document.getElementById(screenId);
      if (!screenElement) {
        throw new Error(`Screen element for ${screenId} not found.`);
      }
      screenElement.classList.add(this._hiddenClassName);
    });
  }

  public setCurrentScreen(screenId: string): void {
    if (!this._screens.includes(screenId)) {
      throw new Error(`Screen ${screenId} is not managed by this ScreenManager.`);
    }
    document.getElementById(this._currentScreen)?.classList.add(this._hiddenClassName);
    document.getElementById(screenId)?.classList.remove(this._hiddenClassName);
    this._currentScreen = screenId;
  }

  public get currentScreen(): string {
    return this._currentScreen;
  }

  public addScreen(screenId: string): void {
    if (this._screens.includes(screenId)) {
      throw new Error(`Screen ${screenId} is already managed by this ScreenManager.`);
    }
    this._screens.push(screenId);
  }
}

export interface ScreenManagerInterface {
  setCurrentScreen(screenId: string): void;
  get currentScreen(): string;
  addScreen(screenId: string): void;
}
