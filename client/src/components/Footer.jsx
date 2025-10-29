export default function Footer(){
  return (
    <footer className="bg-white border-top mt-auto">
       <div className="container-fluid px-3 px-md-4 py-4 d-flex flex-wrap align-items-center gap-3">
        <div className="me-auto text-secondary">
          &copy; {new Date().getFullYear()} CarCare — Atai Toktosunov
        </div>
        <div className="d-flex gap-3">
          <a className="text-secondary" href="#" title="Instagram"><i className="bi bi-instagram fs-5"></i></a>
          <a className="text-secondary" href="#" title="YouTube"><i className="bi bi-youtube fs-5"></i></a>
          <a className="text-secondary" href="#" title="GitHub"><i className="bi bi-github fs-5"></i></a>
        </div>
      </div>
    </footer>
  );
}
