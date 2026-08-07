import { CalendarDays, Plus, RefreshCw, Route, Users, UserCheck, UserCog, X } from "lucide-react";
import { useState } from "react";
import "../../styles/LeadManagement/LeadHeader.css";
import "../../styles/LeadManagement/LeadStats.css";
import "./Employees.css";

const domains = ["DizitalAdda", "Nidads", "Nigape", "Nihacs", "HackingVidya", "IIDAD", "Nifase", "DesigningVidya", "LanguageVidya"];
const initialForm = { full_name: "", email: "", mobile: "", role: "COUNSELLOR", domains: [], courses: "", auto_assign: true };

const Employees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const toggleDomain = (domain) => setForm((current) => ({ ...current, domains: current.domains.includes(domain) ? current.domains.filter((item) => item !== domain) : [...current.domains, domain] }));
  const submit = (event) => { event.preventDefault(); setIsFormOpen(false); setForm(initialForm); };
  const statCards = [
    ["Total Employees", "—", "Database data will appear here", Users, "blue"],
    ["Active Counsellors", "—", "Available for assignments", UserCheck, "green"],
    ["Auto-routing Enabled", "—", "Mapped to domain & course", Route, "purple"],
    ["Managers", "—", "Database data will appear here", UserCog, "orange"],
  ];

  return <section className="employees-page">
    <section className="lead-header">
      <div className="lead-header-left"><span className="lead-badge">Team Management</span><h1>Employees</h1><p>Create employee accounts and map counsellors to domains and courses for automatic lead assignment.</p></div>
      <div className="lead-header-right"><div className="lead-date-card"><CalendarDays size={18}/><div><span>Today</span><strong>{today}</strong></div></div><div className="lead-header-actions"><button className="refresh-btn" type="button"><RefreshCw size={17}/> Refresh</button><button className="create-btn" type="button" onClick={() => setIsFormOpen(true)}><Plus size={18}/> Add Employee</button></div></div>
    </section>

    <section className="lead-stats employee-stats">{statCards.map(([title, value, subtitle, Icon, color]) => <article key={title} className={`lead-stat-card ${color}`}><div className="lead-stat-top"><div><span>{title}</span><h2>{value}</h2><p>{subtitle}</p></div><div className="lead-stat-icon"><Icon size={24}/></div></div></article>)}</section>

    <section className="employee-list-card"><div className="employee-list-heading"><div><h2>Employee directory</h2><p>Employee records will load from the database.</p></div><button type="button" onClick={() => setIsFormOpen(true)}><Plus size={17}/> Add Employee</button></div><div className="employee-empty-state"><Users size={32}/><h3>No employees to display</h3><p>When the employee API is connected, counsellors and their domain mappings will appear here.</p></div></section>

    {isFormOpen && <div className="employee-modal-overlay" role="presentation"><form className="employee-modal" onSubmit={submit}><header><div><span>New team member</span><h2>Add Employee</h2><p>Create a counsellor and define which incoming leads can be assigned to them.</p></div><button type="button" onClick={() => setIsFormOpen(false)} aria-label="Close form"><X size={20}/></button></header><div className="employee-modal-body"><section><h3>Employee details</h3><div className="employee-form-grid"><label>Full name<input value={form.full_name} onChange={(event) => setForm({...form, full_name:event.target.value})} required/></label><label>Work email<input type="email" value={form.email} onChange={(event) => setForm({...form, email:event.target.value})} required/></label><label>Mobile number<input value={form.mobile} onChange={(event) => setForm({...form, mobile:event.target.value})} required/></label><label>Role<select value={form.role} onChange={(event) => setForm({...form, role:event.target.value})}><option value="COUNSELLOR">Counsellor</option><option value="MANAGER">Manager</option></select></label></div></section><section className="routing-section"><div className="routing-heading"><Route size={19}/><div><h3>Lead routing assignment</h3><p>Select every domain this counsellor handles. When routing is enabled, they join the round-robin pool for the selected courses.</p></div></div><div className="domain-checklist">{domains.map((domain) => <label key={domain}><input type="checkbox" checked={form.domains.includes(domain)} onChange={() => toggleDomain(domain)}/><span>{domain}</span></label>)}</div><label className="courses-field">Courses handled <textarea value={form.courses} onChange={(event) => setForm({...form, courses:event.target.value})} placeholder="Example: Digital Marketing, SEO, UI/UX Design"/><small>Separate multiple courses with commas. Course mapping will be saved with this employee.</small></label><label className="routing-toggle"><input type="checkbox" checked={form.auto_assign} onChange={(event) => setForm({...form, auto_assign:event.target.checked})}/><span className="routing-toggle-ui"/><div><strong>Include in automatic assignment</strong><p>New matching leads will be distributed equally among eligible counsellors.</p></div></label></section></div><footer><button type="button" onClick={() => setIsFormOpen(false)}>Cancel</button><button type="submit"><Plus size={17}/> Save Employee</button></footer></form></div>}
  </section>;
};

export default Employees;
