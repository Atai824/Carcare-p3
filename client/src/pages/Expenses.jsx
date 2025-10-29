import { useEffect, useMemo, useState } from "react";
import { getCars, addExpense, listExpenses, expensesSummary } from "../api";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

export default function Expenses() {
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState("");
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      type: "service",
      amount: "",
      date: "",
      note: ""
    }
  });

  const location = useLocation();
  const fromQuery = new URLSearchParams(location.search).get("car");

  const currentCar = useMemo(
    () => cars.find(c => c._id === carId),
    [cars, carId]
  );

  const loadCars = async () => {
    const { data } = await getCars();
    const list = data.cars || [];
    setCars(list);

    if (list.length) {
      if (fromQuery && list.some(c => c._id === fromQuery)) {
        setCarId(fromQuery);
      } else if (!carId) {
        setCarId(list[0]._id);
      }
    }
  };

  const loadData = async (id) => {
    if (!id) return;
    setLoading(true); setErr("");
    try {
      const [expRes, sumRes] = await Promise.all([
        listExpenses(id),
        expensesSummary(id),
      ]);
      setItems(expRes.data.expenses || []);
      setSummary(sumRes.data || null);
    } catch (e) {
      setErr("Couldn't load expenses");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCars(); }, [location.search]); // если пришли с другой машины
  useEffect(() => { loadData(carId); }, [carId]);

  const onSubmit = async (values) => {
    setErr("");
    try {
      await addExpense({
        carId,
        type: values.type,
        amount: Number(values.amount),
        date: values.date, // YYYY-MM-DD
        note: values.note || ""
      });
      reset({ type: "service", amount: "", date: "", note: "" });
      loadData(carId);
    } catch (e) {
      setErr("Couldn't add expense");
      console.error(e);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="m-0">Expenses</h2>
        <a className="btn btn-outline-secondary" href="/dashboard">← To the garage</a>
      </div>

      {/* выбор машины */}
      <div className="card mt-3">
        <div className="card-body">
          <label className="form-label">Car</label>
          <select className="form-select" value={carId} onChange={e => setCarId(e.target.value)}>
            {cars.map(c => (
              <option key={c._id} value={c._id}>
                {c.make} {c.model} {c.year} {c.nickname ? `— ${c.nickname}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* сводка */}
      {summary && (
        <div className="row g-3 mt-3">
          <div className="col-sm-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-secondary small mb-1">Total servises</div>
                <div className="fs-4 fw-bold">{summary.count}</div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-secondary small mb-1">Total</div>
                <div className="fs-4 fw-bold">${Number(summary.total).toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-secondary small mb-1">Car</div>
                <div className="fw-semibold">
                  {currentCar ? `${currentCar.make} ${currentCar.model} ${currentCar.year}` : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* форма */}
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title mb-3">Add expenses</h5>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
            <div className="col-sm-3">
              <label className="form-label">Type</label>
              <select className="form-select" {...register("type")}>
                <option value="service">Service</option>
                <option value="parts">Parts</option>
                <option value="fuel">Fuel</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-sm-3">
              <label className="form-label">Total, $</label>
              <input type="number" step="0.01" className="form-control" {...register("amount", { required: true })} />
            </div>
            <div className="col-sm-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" {...register("date", { required: true })} />
            </div>
            <div className="col-sm-12">
              <label className="form-label">Note</label>
              <input className="form-control" placeholder="Например: Oil change + filter" {...register("note")} />
            </div>
            <div className="col-sm-12">
              <button disabled={isSubmitting || !carId} className="btn btn-primary">
                {isSubmitting ? "Saving..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* список */}
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title mb-3">History</h5>
          {loading ? "Loading..." : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 110 }}>Date</th>
                    <th style={{ width: 120 }}>Type</th>
                    <th>Note</th>
                    <th style={{ width: 120 }} className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(x => (
                    <tr key={x._id}>
                      <td>{new Date(x.date).toLocaleDateString()}</td>
                      <td><span className="badge bg-light text-dark text-capitalize">{x.type}</span></td>
                      <td className="text-secondary">{x.note || "—"}</td>
                      <td className="text-end">${Number(x.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                  {!items.length && (
                    <tr><td colSpan={4} className="text-secondary">Nothing</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
