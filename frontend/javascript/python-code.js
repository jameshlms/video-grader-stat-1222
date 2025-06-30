const pythonCodePath = "./python/grading_logic.py";
const escapeStart = `
# %% [markdown]
# Grading Algorithm

# %%`;
const escapeEnd = `
# %%`;
export function getGradingLogic() {
    return new Promise((resolve) => {
        fetch(pythonCodePath)
            .then((response) => response.text())
            .then((content) => {
            const pattern = new RegExp(`${escapeStart}(.*?)${escapeEnd}`, "s");
            const match = content.match(pattern);
            const gradingLogic = match ? match[1].trim() : null;
            resolve(gradingLogic);
        })
            .catch(() => resolve(null));
    });
}
