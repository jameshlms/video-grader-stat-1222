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

export async function getGradingLogic(): Promise<NotebookCell[]> {
  const cells = await fetch(notebookUrl)
    .then((response) => response.json())
    .then((notebook) => notebook.cells || [])
    .catch(() => {
      console.error("Failed to fetch notebook cells.");
      return [];
    });

  const gradingLogicCells: NotebookCell[] = cells.filter(
    (cell: NotebookCell) =>
      cell.cell_type === "code" &&
      cell.metadata.tags &&
      cell.metadata.tags.includes("grading-logic")
  );

  return gradingLogicCells;

  // try {
  //   const response = await fetch(notebookUrl);
  //   const notebook = await response.json();
  //   const cells: Array<NotebookCell> = notebook.cells || [];
  //   const gradingLogicCell: NotebookCell | undefined = cells.find(
  //     (cell: NotebookCell) =>
  //       cell.cell_type === "code" &&
  //       cell.metadata.tags.includes("grading-logic")
  //   );

  //   if (gradingLogicCell && gradingLogicCell.source) {
  //     const gradingLogic = gradingLogicCell.source.join("\n").trim();
  //     return gradingLogic;
  //   } else {
  //     return null;
  //   }
  // } catch {
  //   return null;
  // }
}
