import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register: doRegister } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await doRegister(name, email, password);
      nav("/dashboard");
    } catch {
      setErr("Registration error");
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <h2 className="mb-3">Register</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={onSubmit} className="vstack gap-3" style={{maxWidth: 520}}>
        <input className="form-control" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-dark">Create account</button>
        <div className="text-secondary">Already have an account? <Link to="/login">Login</Link></div>
      </form>
    </div>
  );
}
