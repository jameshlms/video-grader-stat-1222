const notebookUrl =
  "https://raw.githubusercontent.com/jameshlms/video-grader-stat-1222/main/dev/grading_logic.ipynb";

type NotebookCell = {
  cell_type: string;
  execution_count?: number | null;
  id: string;
  metadata: {
    tags: string[];
  };
  source: string[];
  outputs?: any[] | null;
};

export async function getGradingLogic(): Promise<string | null> {
  const cells: NotebookCell[] = await fetch(notebookUrl)
    .then((response) => response.json())
    .then((notebook) => notebook.cells || [])
    .catch(() => {
      console.error("Failed to fetch notebook cells.");
      return [];
    });

  const gradingLogicCell: NotebookCell | undefined = cells.find(
    (cell: NotebookCell) => cell.cell_type === "code" && cell.id === "9d96cc92"
  );

  if (!gradingLogicCell || !gradingLogicCell.source) {
    console.error("Grading logic cell not found or has no source.");
    return null;
  }

  const pythonCode: string[] = gradingLogicCell.source;
  const gradingLogic: string = pythonCode.join("").trim();
  console.log("Successfully retrieved grading logic");
  return gradingLogic;
}
