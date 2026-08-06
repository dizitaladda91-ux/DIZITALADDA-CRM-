import { Camera, Globe2, MapPin, MessageCircle, Plus, Search, Share2 } from "lucide-react";
import "./leadSources.css";

const sources = [
  { name:"Website enquiry", channel:"Website", icon:<Globe2 size={19}/>, leads:"184", conversion:"16.8%", status:"Active" },
  { name:"Instagram lead form", channel:"Meta", icon:<Camera size={19}/>, leads:"126", conversion:"13.5%", status:"Active" },
  { name:"WhatsApp enquiry", channel:"WhatsApp", icon:<MessageCircle size={19}/>, leads:"89", conversion:"21.3%", status:"Active" },
  { name:"Walk-in referral", channel:"Offline", icon:<MapPin size={19}/>, leads:"42", conversion:"28.6%", status:"Active" },
];

const LeadSources = () => <section className="source-workspace">
  <header><div><p>Lead capture</p><h1>Lead sources</h1><span>Organise every channel that brings new enquiries into your CRM.</span></div><button type="button"><Plus size={18}/> Add source</button></header>
  <div className="source-summary"><article><Share2 size={20}/><div><span>Active sources</span><strong>8</strong></div></article><article><Globe2 size={20}/><div><span>Leads this month</span><strong>441</strong></div></article><article><MessageCircle size={20}/><div><span>Best conversion</span><strong>28.6%</strong></div></article></div>
  <div className="source-panel"><div className="source-toolbar"><label><Search size={18}/><input placeholder="Search sources..."/></label><button type="button">Filters</button></div><div className="source-list">{sources.map((source) => <article key={source.name}><div className="source-icon">{source.icon}</div><div className="source-title"><strong>{source.name}</strong><span>{source.channel}</span></div><div><small>Leads</small><strong>{source.leads}</strong></div><div><small>Conversion</small><strong>{source.conversion}</strong></div><span className="source-status">{source.status}</span><button type="button" className="source-more">•••</button></article>)}</div></div>
</section>;

export default LeadSources;
