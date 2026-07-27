const API_BASE = import.meta.env.VITE_API_BASE || "";

export const fetchLeadSources = async () => {
  const res = await fetch(`${API_BASE}/api/lead-sources`);
  if (!res.ok) throw new Error("Failed to load lead sources");
  const json = await res.json();
  return json.data || [];
};

export const createLeadSource = async (payload) => {
  const res = await fetch(`${API_BASE}/api/lead-sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create lead source");
  }
  const json = await res.json();
  return json.data;
};

export default { fetchLeadSources, createLeadSource };
