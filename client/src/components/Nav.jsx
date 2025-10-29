import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container-fluid px-3 px-md-4">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <Logo size={22} />
          <span>CarCare</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainnav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainnav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cars/new" className="nav-link">Add Car</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/expenses" className="nav-link">Expenses</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/forum" className="nav-link">Forum</NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-secondary small">Hello, {user.name}</span>
                <button onClick={logout} className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-outline-secondary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
