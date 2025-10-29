import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (e) {
      setErr("Login error");
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <h2 className="mb-3">Login</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={onSubmit} className="vstack gap-3" style={{maxWidth: 480}}>
        <input className="form-control" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="form-control" type="password" placeholder="Password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary">Sign in</button>
        <div className="text-secondary">Don't have an account? <Link to="/register">Register</Link></div>
      </form>
    </div>
  );
}
