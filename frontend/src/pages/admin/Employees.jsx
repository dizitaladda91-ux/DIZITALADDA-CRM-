import { CalendarClock, UserCheck, Users } from "lucide-react";
import WorkspacePage from "../../components/workspace/WorkspacePage";

const Employees = () => <WorkspacePage
  eyebrow="Team management"
  title="Employees"
  description="Manage counsellors, managers, departments and team availability from one workspace."
  primaryLabel="Add employee"
  secondaryLabel="Export employees"
  stats={[
    { label: "Total employees", value: "—", helper: "Database data will appear here", icon: <Users size={20} />, tone: "blue" },
    { label: "Active today", value: "—", helper: "Database data will appear here", icon: <UserCheck size={20} />, tone: "green" },
    { label: "Counsellors", value: "—", helper: "Database data will appear here", icon: <Users size={20} />, tone: "purple" },
    { label: "On leave", value: "—", helper: "Database data will appear here", icon: <CalendarClock size={20} />, tone: "amber" },
  ]}
  tabs={["All employees", "Active", "Counsellors", "Managers", "On leave"]}
  columns={[
    { key: "name", label: "Employee", highlight: true },
    { key: "department", label: "Department" },
    { key: "role", label: "Role", badge: true },
    { key: "active_leads", label: "Active leads" },
    { key: "status", label: "Status", badge: true },
  ]}
  rows={[]}
/>;

export default Employees;
