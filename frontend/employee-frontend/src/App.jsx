import { Routes, Route } from "react-router-dom"
import Login from "./Pages/Login"
import Employees from "./Pages/Employees"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/employees" element={<Employees />} />
    </Routes>
  )
}

export default App
