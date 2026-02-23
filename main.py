from fastapi import FastAPI, Depends
from models import Employee
from database import Session, engine
import database_models
from sqlalchemy.orm import Session as SQLSession
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_models.Base.metadata.create_all(bind=engine)

employees = [
        Employee(emp_id= 1, name= "Alice", department= "HR", salary= 50000),
        Employee(emp_id= 2, name= "Bob", department= "Engineering", salary= 70000),
        Employee(emp_id= 3, name= "Charlie", department= "Sales", salary= 60000)
    ]

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

def init_db():
    db = Session()
    count =db.query(database_models.Employee).count()
    if count ==0:
        for employee in employees:
            db.add(database_models.Employee(**employee.model_dump()))
        db.commit()

init_db()

@app.get("/employees")
def get_employees(db: SQLSession = Depends(get_db)):
    #DB connection and query to fetch all employees
    # db = Session()
    db_employees = db.query(database_models.Employee).all()
    return db_employees

@app.get("/employees/{emp_id}")
def get_employee(emp_id: int, db:SQLSession = Depends(get_db)):
    db_product = db.query(database_models.Employee).filter(database_models.Employee.emp_id == emp_id).first( )
    if db_product:
        return db_product
                                                                                   
    return {"error": "Employee not found"}

@app.post("/employees")
def add_employee(employee: Employee, db:SQLSession = Depends(get_db)):
    db.add(database_models.Employee(**employee.model_dump()))
    db.commit()
    return {"message": "Employee added successfully"}

@app.put("/employees/{emp_id}")
def update_employee(emp_id:int, employee: Employee, db:SQLSession = Depends(get_db)):
    db_employee = db.query(database_models.Employee).filter(database_models.Employee.emp_id == emp_id).first()
    if db_employee:
        db_employee.name = employee.name
        db_employee.department = employee.department
        db_employee.salary = employee.salary
        db.commit()
        return {"message": "Employee updated successfully"}
    else:
        return {"error": "Employee not found"}

@app.delete("/employees/{emp_id}")
def delete_employee(emp_id: int, db:SQLSession = Depends(get_db)):
    db_employee = db.query(database_models.Employee).filter(database_models.Employee.emp_id == emp_id).first()
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return {"message": "Employee deleted successfully"}
    else:
        return {"error": "Employee not found"}