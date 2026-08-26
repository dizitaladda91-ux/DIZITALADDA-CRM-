import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  LoaderCircle,
  Plus,
  RefreshCw,
  Route,
  Users,
  UserCheck,
  UserCog,
  X,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { createEmployee, getEmployees } from "../../services/employeeService";
import { getDepartments } from "../../services/departmentService";
import { createDomainCourse, createRoutingAssignment, getLeadRoutingSetup } from "../../services/leadRoutingService";
import EmployeePerformanceModal from "../../components/admin/employees/EmployeePerformanceModal";
import "../../styles/LeadManagement/LeadHeader.css";
import "../../styles/LeadManagement/LeadStats.css";
import "./Employees.css";

const initialForm = {
  full_name: "",
  email: "",
  mobile: "",
  department_id: "",
  designation: "Counsellor",
  password: "",
  domains: [],
  courses: "",
  auto_assign: true,
};

const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Employees = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [routing, setRouting] = useState({ domains: [], assignments: [] });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Performance Modal State
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isPerfModalOpen, setIsPerfModalOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [employeeResponse, departmentResponse, routingResponse] = await Promise.all([
        getEmployees({ limit: 100 }),
        getDepartments(),
        getLeadRoutingSetup(),
      ]);
      setEmployees(employeeResponse?.data?.employees || []);
      setDepartments(departmentResponse?.data || []);
      setRouting(routingResponse?.data || { domains: [], assignments: [] });
    } catch (error) {
      console.error("Failed to load employee data:", error);
      toast.error(error?.response?.data?.message || "Could not load employee data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const domainsFor = (id) => [
    ...new Set(
      routing.assignments
        .filter((item) => Number(item.employee_id) === Number(id) && item.is_active)
        .map((item) => item.domain_name)
    ),
  ];

  const routedIds = new Set(
    routing.assignments.filter((item) => item.auto_assign && item.is_active).map((item) => item.employee_id)
  );

  const counsellors = employees.filter((employee) => employee.role === "COUNSELLOR");

  const cards = [
    ["Total Employees", employees.length, "From database", Users, "blue"],
    ["Active Counsellors", counsellors.filter((item) => item.status === "ACTIVE").length, "Available for assignments", UserCheck, "green"],
    ["Auto-routing Enabled", routedIds.size, "Mapped to domain & course", Route, "purple"],
    ["Managers & Admins", employees.filter((item) => item.role === "ADMIN").length, "System administrators", UserCog, "orange"],
  ];

  const toggleDomain = (id) =>
    setForm((current) => ({
      ...current,
      domains: current.domains.includes(id)
        ? current.domains.filter((item) => item !== id)
        : [...current.domains, id],
    }));

  const openPerformanceModal = (employee) => {
    setSelectedEmployee(employee);
    setIsPerfModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.department_id) return toast.error("Please select a department.");
    try {
      setSaving(true);
      const result = await createEmployee({
        full_name: form.full_name,
        email: form.email,
        mobile: form.mobile,
        department_id: Number(form.department_id),
        designation: form.designation,
        role: "COUNSELLOR",
        password: form.password,
        employment_type: "FULL_TIME",
        status: "ACTIVE",
      });

      const employee = result?.data;
      const courses = form.courses.split(",").map((item) => item.trim()).filter(Boolean);
      let setup = routing;

      for (const domainId of form.domains) {
        let domain = setup.domains.find((item) => Number(item.id) === Number(domainId));
        for (const courseName of courses) {
          let course = domain?.courses?.find((item) => item.name.toLowerCase() === courseName.toLowerCase());
          if (!course) {
            await createDomainCourse({ domain_id: domainId, name: courseName });
            setup = (await getLeadRoutingSetup()).data;
            domain = setup.domains.find((item) => Number(item.id) === Number(domainId));
            course = domain?.courses?.find((item) => item.name.toLowerCase() === courseName.toLowerCase());
          }
          if (employee && course && form.auto_assign) {
            await createRoutingAssignment({
              employee_id: employee.id,
              domain_id: domainId,
              course_id: course.id,
              auto_assign: true,
            });
          }
        }
      }

      toast.success("Employee created successfully.");
      setForm(initialForm);
      setFormOpen(false);
      await load();
    } catch (error) {
      console.error("Failed to create employee:", error);
      toast.error(error?.response?.data?.message || "Could not save employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="employees-page">
      {/* Header Banner */}
      <section className="lead-header">
        <div className="lead-header-left">
          <span className="lead-badge">Team Management</span>
          <h1>Employees & Performance Scorecards</h1>
          <p>Track counselling workload, conversion performance, week-wise & month-wise analytics.</p>
        </div>
        <div className="lead-header-right">
          <div className="lead-date-card">
            <CalendarDays size={18} />
            <div>
              <span>Today</span>
              <strong>{today}</strong>
            </div>
          </div>
          <div className="lead-header-actions">
            <button className="refresh-btn" type="button" onClick={load} disabled={loading}>
              <RefreshCw size={17} className={loading ? "spin" : ""} /> Refresh
            </button>
            <button className="create-btn" type="button" onClick={() => setFormOpen(true)}>
              <Plus size={18} /> Add Employee
            </button>
          </div>
        </div>
      </section>

      {/* Top 4 Stat Cards */}
      <section className="lead-stats employee-stats">
        {cards.map(([title, value, subtitle, Icon, color]) => (
          <article key={title} className={`lead-stat-card ${color}`}>
            <div className="lead-stat-top">
              <div>
                <span>{title}</span>
                <h2>{loading ? "—" : value}</h2>
                <p>{subtitle}</p>
              </div>
              <div className="lead-stat-icon">
                <Icon size={24} />
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Employee Data Table */}
      <section className="employee-table-card">
        <div className="employee-list-heading">
          <div>
            <h2>Employee Directory & Performance</h2>
            <p>View counselling workload, assigned leads, and live conversion statistics.</p>
          </div>
          <button type="button" onClick={() => setFormOpen(true)}>
            <Plus size={17} /> Add Employee
          </button>
        </div>

        <div className="employee-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Status</th>
                <th>Domains</th>
                <th>Department</th>
                <th style={{ textAlign: "right" }}>Performance Scorecard</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="employee-identity">
                      <span>{initials(employee.full_name)}</span>
                      <div>
                        <strong>{employee.full_name}</strong>
                        <small>{employee.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`employee-status ${employee.status === "ACTIVE" ? "active" : "inactive"}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <div className="domain-tags">
                      {domainsFor(employee.id).length
                        ? domainsFor(employee.id).map((domain) => <span key={domain}>{domain}</span>)
                        : "—"}
                    </div>
                  </td>
                  <td>{employee.department_name || "Admissions"}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="view-more-btn"
                      type="button"
                      onClick={() => openPerformanceModal(employee)}
                      style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
                    >
                      <TrendingUp size={15} />
                      <span>View Performance</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && !employees.length && (
            <div className="employee-empty-state">
              <Users size={32} />
              <h3>No employees found</h3>
              <p>Add your first employee to begin.</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Employee Modal */}
      {formOpen && (
        <div className="employee-modal-overlay">
          <form className="employee-modal" onSubmit={submit}>
            <header>
              <div>
                <span>New team member</span>
                <h2>Add Employee</h2>
                <p>Map this counsellor to domains and courses for automatic routing.</p>
              </div>
              <button type="button" onClick={() => setFormOpen(false)}>
                <X size={20} />
              </button>
            </header>
            <div className="employee-modal-body">
              <section>
                <h3>Employee details</h3>
                <div className="employee-form-grid">
                  <label>
                    Full name
                    <input
                      value={form.full_name}
                      onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Work email
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Mobile number
                    <input
                      value={form.mobile}
                      onChange={(event) => setForm({ ...form, mobile: event.target.value })}
                      pattern="[6-9][0-9]{9}"
                      required
                    />
                  </label>
                  <label>
                    Department
                    <select
                      value={form.department_id}
                      onChange={(event) => setForm({ ...form, department_id: event.target.value })}
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.department_name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Designation
                    <input
                      value={form.designation}
                      onChange={(event) => setForm({ ...form, designation: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Temporary password
                    <input
                      type="password"
                      minLength="8"
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      required
                    />
                  </label>
                </div>
              </section>

              <section className="routing-section">
                <div className="routing-heading">
                  <Route size={19} />
                  <div>
                    <h3>Lead routing assignment</h3>
                    <p>Matching leads are distributed equally among eligible active counsellors.</p>
                  </div>
                </div>
                <div className="domain-checklist">
                  {routing.domains.map((domain) => (
                    <label key={domain.id}>
                      <input
                        type="checkbox"
                        checked={form.domains.includes(domain.id)}
                        onChange={() => toggleDomain(domain.id)}
                      />
                      <span>{domain.name}</span>
                    </label>
                  ))}
                </div>
                <label className="courses-field">
                  Courses handled
                  <textarea
                    value={form.courses}
                    onChange={(event) => setForm({ ...form, courses: event.target.value })}
                    placeholder="Digital Marketing, SEO, Data Analytics"
                  />
                  <small>Separate courses with commas.</small>
                </label>
              </section>
            </div>
            <footer>
              <button type="button" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" disabled={saving}>
                {saving ? <LoaderCircle className="spin" size={17} /> : <Plus size={17} />}
                {saving ? "Saving..." : "Save Employee"}
              </button>
            </footer>
          </form>
        </div>
      )}

      {/* Connected Employee Performance Scorecard Modal */}
      <EmployeePerformanceModal
        employee={selectedEmployee}
        isOpen={isPerfModalOpen}
        onClose={() => setIsPerfModalOpen(false)}
      />
    </section>
  );
};

export default Employees;
