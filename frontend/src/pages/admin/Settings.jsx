import { Bell, Building2, Route, ShieldCheck, SlidersHorizontal, UsersRound } from "lucide-react";
import WorkspacePage from "../../components/workspace/WorkspacePage";
import "./Settings.css";

const settingCards = [
  ["Lead routing", "Set manual and automatic assignment rules by domain, course and counsellor.", <Route size={21} />],
  ["Domains & courses", "Create the course catalogue used to route incoming leads.", <Building2 size={21} />],
  ["Users & roles", "Define admin, manager and counsellor access.", <UsersRound size={21} />],
  ["Notifications", "Choose reminders, overdue alerts and daily summaries.", <Bell size={21} />],
  ["Pipeline settings", "Configure lead stages, loss reasons and mandatory fields.", <SlidersHorizontal size={21} />],
  ["Security", "Password, session and audit-log preferences.", <ShieldCheck size={21} />],
];

const Settings = () => <WorkspacePage eyebrow="Administration" title="Settings" description="Configure how your CRM, lead routing and team workspace works." primaryLabel="Save changes" secondaryLabel="View audit log">
  <div className="settings-grid">{settingCards.map(([title, text, icon]) => <button type="button" className="settings-card" key={title}><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div><small>Configure →</small></button>)}</div>
</WorkspacePage>;

export default Settings;
