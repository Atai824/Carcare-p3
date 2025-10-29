// client/src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* HERO */}
      <header className="py-5 bg-white border-bottom">
        <div className="container-fluid px-3 px-md-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold mb-3">Welcome to CarCare</h1>
              <p className="lead text-secondary">
                Keep a service history: add cars, expenses, photos, and get summaries.
                Plus a public forum for questions and answers on car repair and maintenance.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-3">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn btn-primary">To the office</Link>
                    <Link to="/cars/new" className="btn btn-outline-secondary">Add car</Link>
                    <Link to="/forum" className="btn btn-warning text-dark">
                      <i className="bi bi-chat-left-text me-1"></i> Forum
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary">Register</Link>
                    <Link to="/login" className="btn btn-outline-secondary">Login</Link>
                  </>
                )}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="section-light card-soft p-4">
                <h5 className="mb-3">What CarCare can do</h5>
                <ul className="list-unstyled m-0">
                  <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>Car garage with photos</li>
                  <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>Cost accounting and summaries</li>
                  <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>Public Forum</li>
                  <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i>Convenient and fast</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="py-5">
        <div className="container-fluid px-3 px-md-4">
          <div className="row g-4">
            <Feature icon="car-front" title="Garage">
              Keep your brand, VIN, mileage, and media all in one place.
            </Feature>
            <Feature icon="receipt" title="Expenses">
              Services, spare parts, fuel. Summary of costs for the period.
            </Feature>
            <Feature icon="images" title="Gallery">
              Upload before/after photos, receipts, and damages.
            </Feature>
            <Feature icon="chat-left-text" title="Forum">
              Ask questions and share your experience publicly.
            </Feature>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, children }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className="section-light card-soft h-100 p-4">
        <div className="d-flex align-items-center gap-3 mb-2">
          <i className={`bi bi-${icon} fs-3 text-secondary`}></i>
          <h5 className="m-0">{title}</h5>
        </div>
        <p className="text-secondary m-0">{children}</p>
      </div>
    </div>
  );
}
