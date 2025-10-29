import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCars, deleteCar, uploadCarPhoto } from "../api";

export default function Dashboard() {
  const [cars,setCars] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const {data} = await getCars();
      setCars(data.cars || []);
    } catch (e) {
      setError("Couldn't load car list");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); },[]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete car?")) return;
    await deleteCar(id);
    load();
  };

  const onUpload = async (carId, file) => {
    await uploadCarPhoto(carId, file);
    load();
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">My Garage</h2>
        <Link to="/cars/new" className="btn btn-primary">Add Car</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-3">
          {cars.map(car => (
            <div className="col" key={car._id}>
              <div className="card h-100 shadow-sm">
                {car.photos?.length ? (
                  <img src={`${import.meta.env.VITE_API || "http://localhost:4000"}${car.photos[0]}`} className="card-img-top" alt="car" />
                ) : (
                  <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{height:180}}>
                    <i className="bi bi-image text-secondary fs-1"></i>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{car.make} {car.model} {car.year}</h5>
                  <p className="card-text text-secondary small mb-2">
                    VIN: {car.vin || "—"} · Mileage: {car.mileage ?? 0}
                  </p>

                  <div className="d-flex flex-wrap gap-2">
                    <label className="btn btn-outline-secondary btn-sm mb-0">
                      <i className="bi bi-upload me-1"></i> Photo
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e)=> e.target.files[0] && onUpload(car._id, e.target.files[0])}
                      />
                    </label>

                    <Link className="btn btn-outline-primary btn-sm" to={`/expenses?car=${car._id}`}>
                      <i className="bi bi-receipt me-1"></i>Expenses
                    </Link>
                    <button className="btn btn-outline-danger btn-sm" onClick={()=>onDelete(car._id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!cars.length && (
            <div className="col-12">
              <div className="alert alert-info">The garage is empty. Click "Add Car".</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
