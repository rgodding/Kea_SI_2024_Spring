from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],
)

@app.get("/")
def _():
    return { "message": "Hello, World!"}


@app.get("/firstRoute")
def _():
    return { "message": "Hello, First Route!"}

@app.post("/postRoute/{id}")
def _(id: str):
    return { 
        "message": "Hello, Post Route!", 
        "id": id
    }


# CORS allow all
@app.middleware("http")
async def cors_middleware(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response