from fastapi import FastAPI, Form, Request, File
from fastapi.templating import Jinja2Templates
app = FastAPI()

templates = Jinja2Templates(directory="templates")

@app.get("/")
def serve_root_page(request: Request):
    return templates.TemplateResponse("index.html", { "request": request})


@app.post("/form")
def basic_form(username: str = Form(...), password: str = Form(...)):
    print(username, password)
    return {"username": username, "password": password }

@app.post("/fileform")
def file_form(file: bytes = File(...)):
    
    print(file)