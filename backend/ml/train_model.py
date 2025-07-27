from sklearn.linear_model import LinearRegression
import joblib

# Example data
X = [[1], [2], [3], [4]]
y = [2, 4, 6, 8]

# Train a basic model
model = LinearRegression()
model.fit(X, y)

# Save the model to a file
joblib.dump(model, 'ml_model.pkl')
