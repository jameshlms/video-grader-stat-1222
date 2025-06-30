# %% [markdown]
# # Grading Logic
#
# Copy and paste the specified cell's code into the _python-snippet.js_ file as the value of `pythonCode`.
#

# %% [markdown]
# Global variables that would be given by javascript:
#

# %%
all_names = [
    "Ada Lovelace",
    "Alan Turing",
    "John Doe",
    "Jane Smith",
    "Emily Johnson",
    "Nick Fury",
]
csv_list = [
    "test_data/statistics_1.csv",
    "test_data/statistics_2.csv",
    "test_data/statistics_3.csv",
]
forgive_deg = 1
threshold = 0.8

# %% [markdown]
# Grading Algorithm

# %%
from pandas import DataFrame, read_csv, Series 
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

for i, csv_file in enumerate(csv_list, start=1):
    vid_col = f"video{i}Completion"

    temp: DataFrame = read_csv(csv_file)
    temp = temp.drop(columns=["Email", "Role"])
    temp = temp.rename(columns={"Name": "name", "Completion Rate": vid_col})

    df = df.merge(temp, on="name", how="left")
    df[vid_col] = df[vid_col].fillna(0.0)
    df[vid_col] = df[vid_col].apply(
        lambda x: float(x.rstrip("%")) / 100.0 if isinstance(x, str) else x
    )

    vid_completed: Series[bool] = df[vid_col] >= threshold
    df["forgivenessDegree"] = df["forgivenessDegree"] - (~vid_completed).astype(int)
    df["completed"] = (df["completed"] & vid_completed) | (df["forgivenessDegree"] >= 0)


ignored_missing_vids: Series[int] = where(
    df["forgivenessDegree"] - forgive_deg >= -forgive_deg,
    -(df["forgivenessDegree"] - forgive_deg),
    forgive_deg,
)
df["ignoredMissingVideos"] = ignored_missing_vids
df = df.drop(columns=["forgivenessDegree"])

result: str = dumps(
    {
        "count": num_students,
        "data": df.to_dict(orient="list"),
    }
)

# %%
import json

str(json.loads(result))
