# train_heart_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load cleaned dataset
df = pd.read_csv(r"D:\VS code Project\healthcare-ai-platform\service\heart_clean.csv")

X = df.drop("target", axis=1)
y = df["target"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Save model
pickle.dump(model, open("heart_model.pkl", "wb"))

print("Heart model saved as heart_model.pkl")
