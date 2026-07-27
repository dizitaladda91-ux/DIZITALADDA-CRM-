import { useEffect, useState } from "react";
import { fetchLeadSources, createLeadSource } from "../../services/leadSourceService";
import "./leadSources.css";

const LeadSources = () => {
  const [sources, setSources] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchLeadSources();
      setSources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const created = await createLeadSource({ name: name.trim() });
      setSources((s) => [created, ...s]);
      setName("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="lead-sources-page">
      <h2>Lead Sources</h2>
      <p>Manage where leads are coming from.</p>

      <form className="lead-source-form" onSubmit={handleCreate}>
        <input
          placeholder="New source name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="lead-sources-list">
        {loading ? (
          <div>Loading…</div>
        ) : (
          sources.map((s) => (
            <div key={s.id} className="lead-source-card">
              <strong>{s.name}</strong>
              <div className="muted">{s.description || ""}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeadSources;
