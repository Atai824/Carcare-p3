import { useState } from 'react';

export default function Forum() {
  const [posts, setPosts] = useState([]); // временно локально
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosts([{ id: crypto.randomUUID(), text, createdAt: new Date().toISOString(), answers: [] }, ...posts]);
    setText('');
  };

  return (
    <div style={{ padding:20 }}>
      <h2>CarCare Forum (MVP UI)</h2>
      <form onSubmit={submit} style={{ display:'grid', gap:8, maxWidth:600 }}>
        <textarea rows="4" value={text} onChange={e=>setText(e.target.value)} placeholder="Опишите проблему: трясёт при торможении..." />
        <button>To publish</button>
      </form>
      <div style={{ marginTop:16, display:'grid', gap:12 }}>
        {posts.map(p => (
          <div key={p.id} style={{ border:'1px solid #333', padding:12 }}>
            <div style={{ fontWeight:600 }}>{new Date(p.createdAt).toLocaleString()}</div>
            <div style={{ whiteSpace:'pre-wrap', marginTop:8 }}>{p.text}</div>
            <div style={{ marginTop:8, fontSize:12, opacity:.7 }}>Answers: {p.answers.length} (offline)</div>
          </div>
        ))}
      </div>
    </div>
  );
}
