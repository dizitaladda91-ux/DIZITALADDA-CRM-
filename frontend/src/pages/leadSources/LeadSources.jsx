import { Globe2, MessageCircle, Plus, Search, Share2 } from "lucide-react";
import "./leadSources.css";

const LeadSources = () => <section className="source-workspace">
  <header><div><p>Lead capture</p><h1>Lead sources</h1><span>Organise every channel that brings new enquiries into your CRM.</span></div><button type="button"><Plus size={18}/> Add source</button></header>
  <div className="source-summary"><article><Share2 size={20}/><div><span>Active sources</span><strong>—</strong></div></article><article><Globe2 size={20}/><div><span>Leads this month</span><strong>—</strong></div></article><article><MessageCircle size={20}/><div><span>Best conversion</span><strong>—</strong></div></article></div>
  <div className="source-panel"><div className="source-toolbar"><label><Search size={18}/><input placeholder="Search sources..."/></label><button type="button">Filters</button></div><div className="source-empty">No lead sources to display. Your saved sources will load here from the database.</div></div>
</section>;

export default LeadSources;
