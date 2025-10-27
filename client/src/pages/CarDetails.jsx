import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [file, setFile] = useState(null);

  const load = async () => {
    const cars = await api.get('/cars').then(r => r.data.cars);
    setCar(cars.find(c => c._id === id) || null);
    setExpenses(await api.get(`/expenses?carId=${id}`).then(r => r.data.expenses));
    setSummary(await api.get(`/expenses/summary/${id}`).then(r => r.data));
  };

  useEffect(() => { load(); }, [id]);

  const addExpense = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.post('/expenses', {
      carId: id,
      type: form.get('type'),
      amount: Number(form.get('amount')),
      date: form.get('date'),
      note: form.get('note') || ''
    });
    e.currentTarget.reset();
    await load();
  };

  const uploadPhoto = async (e) => {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    await api.post(`/upload/car-photo/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setFile(null);
    await load();
  };

  if (!car) return <div style={{ padding:20 }}>Loading...</div>;

  return (
    <div style={{ padding:20, display:'grid', gap:16 }}>
      <h2>{car.nickname} — {car.make} {car.model} ({car.year})</h2>

      <div>
        <strong>Photos:</strong>
        <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
          {car.photos?.map((p, i) => (
            <img key={i} src={import.meta.env.VITE_API + p} alt="" style={{ width:160, height:120, objectFit:'cover', border:'1px solid #333' }} />
          ))}
        </div>
        <form onSubmit={uploadPhoto} style={{ marginTop:8, display:'flex', gap:8 }}>
          <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
          <button>Upload photo</button>
        </form>
      </div>

      <div>
        <strong>Expenses summary:</strong>
        <pre>{JSON.stringify(summary, null, 2)}</pre>
      </div>

      <div>
        <strong>Add expense:</strong>
        <form onSubmit={addExpense} style={{ display:'grid', gap:8, maxWidth:360 }}>
          <input name="type" placeholder="type (service, fuel, etc.)" required />
          <input name="amount" type="number" step="0.01" placeholder="amount" required />
          <input name="date" type="date" required />
          <input name="note" placeholder="note (optional)" />
          <button>Add</button>
        </form>
      </div>

      <div>
        <strong>Expenses:</strong>
        <ul>
          {expenses.map(e => (
            <li key={e._id}>{new Date(e.date).toLocaleDateString()} — {e.type} — ${e.amount.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
