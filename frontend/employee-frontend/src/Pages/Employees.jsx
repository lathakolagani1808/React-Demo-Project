import { useState, useEffect } from "react";

function Employees() {
  const [employees, setEmployees] = useState([]);

  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [salary, setSalary] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${BASE_URL}/employees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = {
      emp_id: empId,
      name: name,
      department: dept,   
      salary: salary,
    };

    try {
      if (!editMode) {
        await fetch(`${BASE_URL}/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        });
      } else {
        await fetch(`${BASE_URL}/employees/${empId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        });
        setEditMode(false);
      }

      fetchEmployees(); 
      resetForm();
      setShowForm(false);

    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/employees/${id}`, {
        method: "DELETE",
      });

      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleEdit = (emp) => {
    setEmpId(emp.emp_id);
    setName(emp.name);
    setDept(emp.department);
    setSalary(emp.salary);
    setEditMode(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setEmpId("");
    setName("");
    setDept("");
    setSalary("");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Employee Management</h2>

      <button onClick={() => setShowForm(true)}>
        Add Employee
      </button>

      <br /><br />

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Emp ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Department"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          />

          <input
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <button type="submit">
            {editMode ? "Update" : "Save"}
          </button>
        </form>
      )}

      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.emp_id}>
              <td>{emp.emp_id}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp.emp_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
