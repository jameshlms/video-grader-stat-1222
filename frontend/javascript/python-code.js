const notebookUrl = "https://raw.githubusercontent.com/jameshlms/video-grader-stat-1222/main/dev/grading_logic.ipynb";
export async function getGradingLogic() {
    const cells = await fetch(notebookUrl)
        .then((response) => response.json())
        .then((notebook) => notebook.cells || [])
        .catch(() => {
        console.error("Failed to fetch notebook cells.");
        return [];
    });
    const gradingLogicCell = cells.find((cell) => cell.cell_type === "code" && cell.id === "9d96cc92");
    if (!gradingLogicCell || !gradingLogicCell.source) {
        console.error("Grading logic cell not found or has no source.");
        return null;
    }
    const pythonCode = gradingLogicCell.source;
    const gradingLogic = pythonCode.join("").trim();
    console.log("Successfully retreived grading logic");
    return gradingLogic;
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
