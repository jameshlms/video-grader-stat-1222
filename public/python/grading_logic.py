from json import dumps

from numpy import where
from pandas import DataFrame, Series, read_csv


def grade(
    all_names: list[str],
    csv_files: list[str],
    completion_threshold: int,
    forgiveness_degree: int,
) -> str:
    names = list(all_names)
    num_students = len(names)

    df = DataFrame(
        {
            "name": names,
            "completed": [True] * num_students,
            "forgivenessDegree": [forgiveness_degree] * num_students,
        }
    )

    for i, csv_file in enumerate(csv_files, start=1):
        vid_col = f"video{i}Completion"

        temp: DataFrame = read_csv(csv_file, usecols=["Name", "Completion Rate"])
        temp = temp.rename(columns={"Name": "name", "Completion Rate": vid_col})

        df = df.merge(temp, on="name", how="left")
        df[vid_col] = df[vid_col].fillna(0.0)
        df[vid_col] = df[vid_col].apply(
            lambda x: float(x.rstrip("%")) / 100.0 if isinstance(x, str) else x
        )

        vid_completed: Series[bool] = df[vid_col] >= completion_threshold
        df["forgivenessDegree"] = df["forgivenessDegree"] - (~vid_completed).astype(int)
        df["completed"] = (df["completed"] & vid_completed) | (
            df["forgivenessDegree"] >= 0
        )

    ignored_missing_vids: Series[int] = where(
        df["forgivenessDegree"] - forgiveness_degree >= -forgiveness_degree,
        -(df["forgivenessDegree"] - forgiveness_degree),
        forgiveness_degree,
    )
    df["ignoredMissingVideos"] = ignored_missing_vids
    df = df.drop(columns=["forgivenessDegree"])

    result: str = dumps(
        {
            "count": num_students,
            "data": df.to_dict(orient="list"),
        }
    )

    return result
