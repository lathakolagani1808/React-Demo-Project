from pydantic import BaseModel

class Employee(BaseModel):
    emp_id: int
    name : str
    department : str
    salary : int
    