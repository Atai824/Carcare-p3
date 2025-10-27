import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    api.get("/cars")
      .then(res => setCars(res.data.cars || []))
      .finally(()=>setLoading(false));
  },[]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Мои машины</h2>
        <Link to="/cars/new" className="btn btn-primary">Добавить машину</Link>
      </div>

      {loading ? <div>Загрузка…</div> : (
        cars.length === 0 ? (
          <div className="alert alert-info">Пока пусто. Добавьте первую машину.</div>
        ) : (
          <div className="row g-3">
            {cars.map(c => (
              <div className="col-sm-6 col-lg-4" key={c._id}>
                <div className="card h-100">
                  {c.photos?.[0] && (
                    <img alt="" className="card-img-top"
                         src={import.meta.env.VITE_API_URL ? 
                           `${import.meta.env.VITE_API_URL}${c.photos[0]}` : `http://localhost:4000${c.photos[0]}`} />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{c.nickname || `${c.make} ${c.model}`}</h5>
                    <div className="text-secondary small">
                      {c.make} {c.model}, {c.year}<br/>
                      VIN: {c.vin}<br/>
                      Mileage: {c.mileage}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
