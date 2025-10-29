import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { forumGet, forumReply } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Topic(){
  const { id } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const { register, handleSubmit, reset, formState:{isSubmitting} } = useForm();

  const load = async () => {
    const { data } = await forumGet(id);
    setThread(data.thread);
  };

  useEffect(()=>{ load(); }, [id]);

  const onReply = async (v) => {
    await forumReply(id, { body: v.body });
    reset({ body: "" });
    load();
  };

  if (!thread) return <div className="container py-4">Loading…</div>;

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="mb-3">
        <Link to="/forum" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title">{thread.title}</h3>
          {thread.tags?.length ? (
            <div className="mb-2">
              {thread.tags.map(tag => <span key={tag} className="badge bg-light text-dark me-1">{tag}</span>)}
            </div>
          ) : null}
          <div className="text-secondary small mb-3">
            Author: {thread.author?.name} • {new Date(thread.createdAt).toLocaleString()} • Views: {thread.views}
          </div>
          <p className="m-0" style={{whiteSpace:"pre-wrap"}}>{thread.body}</p>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Replies ({thread.replies?.length || 0})</h5>
          {!thread.replies?.length && <div className="text-secondary">No replies yet.</div>}
          <div className="list-group">
            {(thread.replies || []).map(r => (
              <div key={r._id} className="list-group-item">
                <div className="small text-secondary mb-1">
                  {r.author?.name} • {new Date(r.createdAt).toLocaleString()}
                </div>
                <div style={{whiteSpace:"pre-wrap"}}>{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {user ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Respond</h5>
            <form onSubmit={handleSubmit(onReply)} className="row g-3">
              <div className="col-12">
                <textarea rows={3} className="form-control" placeholder="Your reply…" {...register("body",{required:true})}/>
              </div>
              <div className="col-12">
                <button className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="alert alert-info">To respond, log in to your account.</div>
      )}
    </div>
  );
}
