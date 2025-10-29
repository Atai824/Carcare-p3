// client/src/pages/Forum.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { forumList, forumCreate } from "../api";

export default function Forum(){
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState:{isSubmitting} } = useForm();

  const load = async (params = {}) => {
    setLoading(true);
    try{
      const { data } = await forumList({ q, skip, limit: 20, ...params });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } finally { setLoading(false); }
  };

  useEffect(() => { load({ skip: 0 }); }, [q]);

  const onCreate = async (v) => {
    await forumCreate({ title: v.title, body: v.body, tags: v.tags?.split(",") || [] });
    reset({ title:"", body:"", tags:"" });
    setSkip(0);
    load({ skip: 0 });
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4 w-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Forum</h2>
        <div className="ms-auto" style={{maxWidth: 360}}>
          <input className="form-control" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>

      {user && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">New topic</h5>
            <form onSubmit={handleSubmit(onCreate)} className="row g-3">
              <div className="col-12">
                <input className="form-control" placeholder="Heading" {...register("title", {required:true})}/>
              </div>
              <div className="col-12">
                <textarea rows={4} className="form-control" placeholder="Text" {...register("body", {required:true})}/>
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="Tags (comma-separated)" {...register("tags")} />
              </div>
              <div className="col-12">
                <button className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Publishing…" : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {loading ? "Loading…" : (
            <>
              {!items.length && <div className="text-secondary">Nothing.</div>}
              <div className="list-group">
                {items.map(t => (
                  <Link key={t._id} to={`/forum/${t._id}`} className="list-group-item list-group-item-action">
                    <div className="d-flex justify-content-between">
                      <h6 className="m-0">{t.title}</h6>
                      <div className="text-secondary small">
                        {new Date(t.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    {t.tags?.length ? (
                      <div className="mt-1">
                        {t.tags.map(tag => (
                          <span key={tag} className="badge bg-light text-dark me-1">{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                ))}
              </div>
              {total > items.length && (
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => { const ns = skip + 20; setSkip(ns); load({ skip: ns }); }}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
