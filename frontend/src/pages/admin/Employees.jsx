import { BriefcaseBusiness, Filter, Mail, MoreHorizontal, Plus, Search, UserCheck, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import "./Employees.css";

const initialEmployees = [
  { id: 1, name: "Riya Sharma", email: "riya@dizitaladda.com", phone: "+91 98765 43210", code: "EMP-1001", department: "Design & Creative", role: "Counsellor", activeLeads: 32, status: "Active" },
  { id: 2, name: "Arjun Mehta", email: "arjun@dizitaladda.com", phone: "+91 98765 43211", code: "EMP-1002", department: "Marketing", role: "Counsellor", activeLeads: 27, status: "Active" },
  { id: 3, name: "Neha Gupta", email: "neha@dizitaladda.com", phone: "+91 98765 43212", code: "EMP-1003", department: "Management", role: "Manager", activeLeads: 0, status: "Active" },
  { id: 4, name: "Vikram Singh", email: "vikram@dizitaladda.com", phone: "+91 98765 43213", code: "EMP-1004", department: "Technology", role: "Counsellor", activeLeads: 19, status: "On leave" },
];

const emptyForm = { name: "", email: "", phone: "", department: "", role: "COUNSELLOR" };
const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

const Employees = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const displayedEmployees = useMemo(() => employees.filter((employee) => {
    const matchesSearch = Object.values(employee).join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || employee.status === status;
    return matchesSearch && matchesStatus;
  }), [employees, query, status]);

  const addEmployee = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.department) return;
    setEmployees((current) => [...current, {
      id: Date.now(), name: form.name.trim(), email: form.email.trim(), phone: form.phone || "—", department: form.department, role: form.role === "MANAGER" ? "Manager" : "Counsellor", code: `EMP-${1000 + current.length + 1}`, activeLeads: 0, status: "Active",
    }]);
    setForm(emptyForm);
    setOpen(false);
  };

  return <section className="employees-page">
    <header className="employees-header"><div><p>Team management</p><h1>Employees</h1><span>Manage counsellors, managers, roles and lead workload in one place.</span></div><button type="button" onClick={() => setOpen(true)}><Plus size={18}/> Add employee</button></header>
    <div className="employee-stats"><article><span className="blue"><Users size={20}/></span><div><small>Total employees</small><strong>{employees.length}</strong><p>Across all departments</p></div></article><article><span className="green"><UserCheck size={20}/></span><div><small>Active today</small><strong>{employees.filter((employee) => employee.status === "Active").length}</strong><p>Available for lead assignment</p></div></article><article><span className="purple"><BriefcaseBusiness size={20}/></span><div><small>Counsellors</small><strong>{employees.filter((employee) => employee.role === "Counsellor").length}</strong><p>Lead handling team</p></div></article><article><span className="amber"><Users size={20}/></span><div><small>On leave</small><strong>{employees.filter((employee) => employee.status === "On leave").length}</strong><p>Review lead distribution</p></div></article></div>
    <section className="employee-table-card"><div className="employee-tabs"><button className={status === "All" ? "active" : ""} onClick={() => setStatus("All")}>All employees</button><button className={status === "Active" ? "active" : ""} onClick={() => setStatus("Active")}>Active</button><button className={status === "On leave" ? "active" : ""} onClick={() => setStatus("On leave")}>On leave</button></div><div className="employee-toolbar"><label><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or department..." /></label><button type="button"><Filter size={17}/> Filters</button></div><div className="employee-table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Active leads</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{displayedEmployees.map((employee) => <tr key={employee.id}><td><div className="employee-identity"><span>{initials(employee.name)}</span><div><strong>{employee.name}</strong><small>{employee.code}</small><small><Mail size={12}/>{employee.email}</small></div></div></td><td>{employee.department}</td><td><span className="role-chip">{employee.role}</span></td><td><strong>{employee.activeLeads}</strong></td><td><span className={`employee-status ${employee.status === "Active" ? "active" : "leave"}`}>{employee.status}</span></td><td><button type="button" className="employee-more" aria-label={`More actions for ${employee.name}`}><MoreHorizontal size={20}/></button></td></tr>)}</tbody></table></div><footer><span>Showing {displayedEmployees.length} of {employees.length} employees</span><span>Employee data will be connected to the API in the next step.</span></footer></section>
    {open && <div className="employee-modal-backdrop" role="presentation"><form className="employee-modal" onSubmit={addEmployee}><header><div><p>New team member</p><h2>Add employee</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Close"><X size={20}/></button></header><p className="employee-modal-copy">Create the staff profile first. Login credentials and API save will be connected next.</p><div className="employee-form-grid"><label>Full name<input autoFocus value={form.name} onChange={(event) => setForm({...form, name:event.target.value})} placeholder="Employee full name" required /></label><label>Work email<input type="email" value={form.email} onChange={(event) => setForm({...form, email:event.target.value})} placeholder="name@company.com" required /></label><label>Mobile number<input value={form.phone} onChange={(event) => setForm({...form, phone:event.target.value})} placeholder="+91 00000 00000" /></label><label>Department<select value={form.department} onChange={(event) => setForm({...form, department:event.target.value})} required><option value="">Select department</option><option>Design & Creative</option><option>Marketing</option><option>Management</option><option>Technology</option></select></label><label>Role<select value={form.role} onChange={(event) => setForm({...form, role:event.target.value})}><option value="COUNSELLOR">Counsellor</option><option value="MANAGER">Manager</option></select></label></div><footer><button type="button" onClick={() => setOpen(false)}>Cancel</button><button type="submit"><Plus size={17}/> Add employee</button></footer></form></div>}
  </section>;
};

export default Employees;
