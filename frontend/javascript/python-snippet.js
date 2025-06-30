const pythonCode = `
from pandas import DataFrame, read_csv
from numpy import where
from json import dumps

all_names = list(all_names)
num_students = len(all_names)

df = DataFrame(
    {
        "name": all_names,
        "completed": [True] * num_students,
        "forgivenessDegree": [forgive_deg] * num_students,
    }
)


def insert_csv(df: DataFrame, csv: str, iteration: int, threshold: float = 0.8) -> DataFrame:
    vid_col = f"video{iteration}Completion"

    temp = read_csv(csv)
    temp = temp.drop(columns=["Email", "Role"])
    temp = temp.rename(columns={"Name": "name", "Completion Rate": vid_col})

    df = df.merge(temp, on="name", how="left")
    df[vid_col] = df[vid_col].fillna(0.0)
    df[vid_col] = df[vid_col].apply(
        lambda x: float(x.rstrip("%")) / 100.0 if isinstance(x, str) else x
    )

    vid_completed = df[vid_col] >= threshold

    df["forgivenessDegree"] = df["forgivenessDegree"] - (~vid_completed).astype(int)
    df["completed"] = (df["completed"] & vid_completed) | (df["forgivenessDegree"] >= 0)

    return df


for i, csv in enumerate(csv_list, start=1):
    df = insert_csv(df, csv, i, threshold=threshold)



ignored_missing_vids = where(
    df["forgivenessDegree"] - forgive_deg >= -forgive_deg,
    -(df["forgivenessDegree"] - forgive_deg),
    forgive_deg
)
df["ignoredMissingVideos"] = ignored_missing_vids
df = df.drop(columns=["forgivenessDegree"])

result = dumps({
    "count": num_students,
    "data": df.to_dict(orient="list"),
})
`;
export { pythonCode };