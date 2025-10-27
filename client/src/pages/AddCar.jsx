import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AddCar() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    make: "", model: "", year: "", vin: "", mileage: "", nickname: ""
  });
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");

  const onChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // 1) создаём машину
      const res = await api.post("/cars", {
        make: form.make,
        model: form.model,
        year: Number(form.year),
        vin: form.vin,
        mileage: Number(form.mileage),
        nickname: form.nickname
      });
      const car = res.data.car;

      // 2) если выбрано фото — грузим
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        await api.post(`/upload/car-photo/${car._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      nav("/dashboard");
    } catch (e) {
      setErr("Не удалось добавить машину");
    }
  };

  return (
    <div className="container py-4" style={{maxWidth: 680}}>
      <h2 className="mb-3">Добавить машину</h2>
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={onSubmit} className="vstack gap-3">
        <div className="row g-2">
          <div className="col-sm">
            <input className="form-control" placeholder="Make" name="make" value={form.make} onChange={onChange}/>
          </div>
          <div className="col-sm">
            <input className="form-control" placeholder="Model" name="model" value={form.model} onChange={onChange}/>
          </div>
          <div className="col-sm-3">
            <input className="form-control" placeholder="Year" name="year" value={form.year} onChange={onChange}/>
          </div>
        </div>

        <div className="row g-2">
          <div className="col-sm">
            <input className="form-control" placeholder="VIN" name="vin" value={form.vin} onChange={onChange}/>
          </div>
          <div className="col-sm">
            <input className="form-control" placeholder="Mileage" name="mileage" value={form.mileage} onChange={onChange}/>
          </div>
          <div className="col-sm">
            <input className="form-control" placeholder="Nickname" name="nickname" value={form.nickname} onChange={onChange}/>
          </div>
        </div>

        <div>
          <input className="form-control" type="file" accept="image/*"
                 onChange={e=>setFile(e.target.files?.[0] || null)} />
          <div className="form-text">Можно добавить 1 фото при создании (опционально).</div>
        </div>

        <button className="btn btn-primary">Сохранить</button>
      </form>
    </div>
  );
}
