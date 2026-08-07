import { CalendarDays, LoaderCircle, Plus, RefreshCw, Route, Users, UserCheck, UserCog, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createEmployee, getEmployees } from "../../services/employeeService";
import { getDepartments } from "../../services/departmentService";
import { createDomainCourse, createRoutingAssignment, getLeadRoutingSetup } from "../../services/leadRoutingService";
import "../../styles/LeadManagement/LeadHeader.css";
import "../../styles/LeadManagement/LeadStats.css";
import "./Employees.css";

const initialForm = { full_name: "", email: "", mobile: "", department_id: "", designation: "Counsellor", password: "", domains: [], courses: "", auto_assign: true };
const initials = (name = "") => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

const Employees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [routing, setRouting] = useState({ domains: [], assignments: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [employeeResponse, departmentResponse, routingResponse] = await Promise.all([getEmployees({ limit: 100 }), getDepartments(), getLeadRoutingSetup()]);
      setEmployees(employeeResponse?.data?.employees || []);
      setDepartments(departmentResponse?.data || []);
      setRouting(routingResponse?.data || { domains: [], assignments: [] });
    } catch (error) { toast.error(error?.response?.data?.message || "Could not load employee data."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggleDomain = (domainId) => setForm((current) => ({ ...current, domains: current.domains.includes(domainId) ? current.domains.filter((item) => item !== domainId) : [...current.domains, domainId] }));
  const counsellors = employees.filter((employee) => employee.role === "COUNSELLOR");
  const activeCounsellors = counsellors.filter((employee) => employee.status === "ACTIVE");
  const routedEmployeeIds = new Set(routing.assignments.filter((item) => item.auto_assign && item.is_active).map((item) => item.employee_id));
  const statCards = [["Total Employees", employees.length, "From database", Users, "blue"], ["Active Counsellors", activeCounsellors.length, "Available for assignments", UserCheck, "green"], ["Auto-routing Enabled", routedEmployeeIds.size, "Mapped to domain & course", Route, "purple"], ["Managers", employees.filter((employee) => employee.role === "ADMIN").length, "From database", UserCog, "orange"]];

  const submit = async (event) => {
    event.preventDefault();
    if (!form.department_id) return toast.error("Please select a department.");
    try {
      setSaving(true);
      const employeeResponse = await createEmployee({ full_name: form.full_name, email: form.email, mobile: form.mobile, department_id: Number(form.department_id), designation: form.designation, role: "COUNSELLOR", password: form.password, employment_type: "FULL_TIME", status: "ACTIVE" });
      const employee = employeeResponse?.data;
      const courses = form.courses.split(",").map((course) => course.trim()).filter(Boolean);
      if (employee && form.auto_assign && form.domains.length && courses.length) {
        let latestSetup = routing;
        for (const domainId of form.domains) {
          let domain = latestSetup.domains.find((item) => Number(item.id) === Number(domainId));
          for (const courseName of courses) {
            let course = domain?.courses?.find((item) => item.name.toLowerCase() === courseName.toLowerCase());
            if (!course) {
              await createDomainCourse({ domain_id: domainId, name: courseName });
              const refreshed = await getLeadRoutingSetup();
              latestSetup = refreshed.data;
              domain = latestSetup.domains.find((item) => Number(item.id) === Number(domainId));
              course = domain?.courses?.find((item) => item.name.toLowerCase() === courseName.toLowerCase());
            }
            if (course) await createRoutingAssignment({ employee_id: employee.id, domain_id: domainId, course_id: course.id, auto_assign: true });
          }
        }
      }
      toast.success("Employee and routing assignments saved.");
      setForm(initialForm); setIsFormOpen(false); await load();
    } catch (error) { toast.error(error?.response?.data?.message || "Could not save employee."); }
    finally { setSaving(false); }
  };

  return <section className="employees-page"><section className="lead-header"><div className="lead-header-left"><span className="lead-badge">Team Management</span><h1>Employees</h1><p>Create counsellor accounts and map domains/courses for automatic lead assignment.</p></div><div className="lead-header-right"><div className="lead-date-card"><CalendarDays size={18}/><div><span>Today</span><strong>{today}</strong></div></div><div className="lead-header-actions"><button className="refresh-btn" type="button" onClick={load} disabled={loading}><RefreshCw size={17} className={loading ? "spin" : ""}/> Refresh</button><button className="create-btn" type="button" onClick={() => setIsFormOpen(true)}><Plus size={18}/> Add Employee</button></div></div></section><section className="lead-stats employee-stats">{statCards.map(([title, value, subtitle, Icon, color]) => <article key={title} className={`lead-stat-card ${color}`}><div className="lead-stat-top"><div><span>{title}</span><h2>{loading ? "—" : value}</h2><p>{subtitle}</p></div><div className="lead-stat-icon"><Icon size={24}/></div></div></article>)}</section><section className="employee-list-card"><div className="employee-list-heading"><div><h2>Employee directory</h2><p>{loading ? "Loading employees..." : `${employees.length} employees from database`}</p></div><button type="button" onClick={() => setIsFormOpen(true)}><Plus size={17}/> Add Employee</button></div>{employees.length ? <div className="employee-grid">{employees.map((employee) => <article key={employee.id} className="employee-row"><span>{initials(employee.full_name)}</span><div><strong>{employee.full_name}</strong><p>{employee.email} · {employee.department_name || "No department"}</p></div><small className={employee.status === "ACTIVE" ? "active" : "inactive"}>{employee.status}</small></article>)}</div> : !loading && <div className="employee-empty-state"><Users size={32}/><h3>No employees found</h3><p>Add your first counsellor to start automatic lead routing.</p></div>}</section>{isFormOpen && <div className="employee-modal-overlay" role="presentation"><form className="employee-modal" onSubmit={submit}><header><div><span>New team member</span><h2>Add Employee</h2><p>Selected course mappings will place this counsellor in round-robin assignment.</p></div><button type="button" onClick={() => setIsFormOpen(false)} aria-label="Close form"><X size={20}/></button></header><div className="employee-modal-body"><section><h3>Employee details</h3><div className="employee-form-grid"><label>Full name<input value={form.full_name} onChange={(event) => setForm({...form, full_name:event.target.value})} required/></label><label>Work email<input type="email" value={form.email} onChange={(event) => setForm({...form, email:event.target.value})} required/></label><label>Mobile number<input value={form.mobile} onChange={(event) => setForm({...form, mobile:event.target.value})} pattern="[6-9][0-9]{9}" required/></label><label>Department<select value={form.department_id} onChange={(event) => setForm({...form, department_id:event.target.value})} required><option value="">Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.department_name}</option>)}</select></label><label>Designation<input value={form.designation} onChange={(event) => setForm({...form, designation:event.target.value})} required/></label><label>Temporary password<input type="password" minLength="8" value={form.password} onChange={(event) => setForm({...form, password:event.target.value})} required/></label></div></section><section className="routing-section"><div className="routing-heading"><Route size={19}/><div><h3>Lead routing assignment</h3><p>Select domains and enter their courses. This counsellor will receive matching new leads in round-robin order.</p></div></div><div className="domain-checklist">{routing.domains.map((domain) => <label key={domain.id}><input type="checkbox" checked={form.domains.includes(domain.id)} onChange={() => toggleDomain(domain.id)}/><span>{domain.name}</span></label>)}</div><label className="courses-field">Courses handled<textarea value={form.courses} onChange={(event) => setForm({...form, courses:event.target.value})} placeholder="Digital Marketing, SEO, Data Analytics"/><small>Separate multiple courses with commas.</small></label><label className="routing-toggle"><input type="checkbox" checked={form.auto_assign} onChange={(event) => setForm({...form, auto_assign:event.target.checked})}/><span className="routing-toggle-ui"/><div><strong>Include in automatic assignment</strong><p>Matching leads will be shared between every eligible active counsellor.</p></div></label></section></div><footer><button type="button" onClick={() => setIsFormOpen(false)} disabled={saving}>Cancel</button><button type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17}/> : <Plus size={17}/>} {saving ? "Saving..." : "Save Employee"}</button></footer></form></div>}</section>;
};

export default Employees;
