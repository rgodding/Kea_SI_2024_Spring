from fastapi import FastAPI;
from requests import get;

app = FastAPI();

@app.get("/")
def _():
    return {
        "message": "Hello World"
    }

@app.get("/fastapiData")
def _():
    print("FastAPI Data")
    return {
        "message": [1, 2, 3, 4, 5]
    }

@app.get("/requestExpress")
def get_express_data():
    data = get("http://localhost:8080/expressData").json();
    return {
        "data": data
    }