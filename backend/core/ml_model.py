import joblib
import os

# Path to the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../ml/ml_model.pkl')

# Load the model
model = joblib.load(MODEL_PATH)

def predict(value):
    # value: a number
    return model.predict([[value]])[0]
