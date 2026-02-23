import { useNavigate } from "react-router-dom"
import { useState } from "react"

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/employees")   
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px"}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} >
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
