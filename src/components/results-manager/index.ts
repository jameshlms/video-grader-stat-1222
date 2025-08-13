export class ResultsManager {
  private resultsRoot: HTMLElement;
  private errorContainer: HTMLElement;
  private resultsContainer: HTMLElement;

  constructor(elementIDs: { resultsRootId: string; errorContainerId: string; resultsContainerId: string }) {
    this.resultsRoot = document.getElementById(elementIDs.resultsRootId) as HTMLElement;
    this.errorContainer = document.getElementById(elementIDs.errorContainerId) as HTMLElement;
    this.resultsContainer = document.getElementById(elementIDs.resultsContainerId) as HTMLElement;
  }

  public showErrorFeedback(message: string): void {
    this.clear();
    this.errorContainer.innerHTML = `<p class="error">${message}</p>`;
  }

  public showGradingResults(gradingData: GradingData): void {
    this.clear();
    this.resultsContainer.innerHTML = `<pre>${JSON.stringify(gradingData, null, 2)}</pre>`;
  }

  public clear(): void {
    this.resultsContainer.innerHTML = "";
    this.errorContainer.innerHTML = "";
  }
}
