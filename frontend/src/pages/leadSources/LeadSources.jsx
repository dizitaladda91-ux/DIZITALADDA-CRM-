import { Globe2, LoaderCircle, MessageCircle, Plus, Search, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createLeadSource, fetchLeadSources } from "../../services/leadSourceService";
import "./leadSources.css";

const LeadSources = () => {
  const [sources, setSources] = useState([]); const [query, setQuery] = useState(""); const [loading, setLoading] = useState(true); const [newName, setNewName] = useState("");
  const load = async () => { try { setLoading(true); setSources(await fetchLeadSources()); } catch (error) { toast.error(error.message || "Could not load lead sources."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const addSource = async (event) => { event.preventDefault(); if (!newName.trim()) return; try { await createLeadSource({ name: newName.trim() }); setNewName(""); toast.success("Lead source created."); await load(); } catch (error) { toast.error(error.message || "Could not create lead source."); } };
  const visibleSources = useMemo(() => sources.filter((source) => `${source.name} ${source.description || ""}`.toLowerCase().includes(query.toLowerCase())), [sources, query]);
  return <section className="source-workspace"><header><div><p>Lead capture</p><h1>Lead sources</h1><span>Organise every channel that brings new enquiries into your CRM.</span></div></header><div className="source-summary"><article><Share2 size={20}/><div><span>Active sources</span><strong>{loading ? "—" : sources.filter((source) => source.is_active).length}</strong></div></article><article><Globe2 size={20}/><div><span>Total sources</span><strong>{loading ? "—" : sources.length}</strong></div></article><article><MessageCircle size={20}/><div><span>Lead routing</span><strong>Ready</strong></div></article></div><div className="source-panel"><div className="source-toolbar"><label><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sources..."/></label><form onSubmit={addSource}><input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="New source name"/><button type="submit"><Plus size={16}/> Add source</button></form></div>{loading ? <div className="source-empty"><LoaderCircle className="spin" size={22}/> Loading sources...</div> : visibleSources.length ? <div className="source-list">{visibleSources.map((source) => <article key={source.id}><div className="source-icon"><Globe2 size={19}/></div><div className="source-title"><strong>{source.name}</strong><span>{source.description || "No description"}</span></div><span className={`source-status ${source.is_active ? "" : "inactive"}`}>{source.is_active ? "Active" : "Inactive"}</span></article>)}</div> : <div className="source-empty">No lead sources found.</div>}</div></section>;
};

export default LeadSources;
