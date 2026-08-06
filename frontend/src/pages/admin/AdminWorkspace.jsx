import { BarChart3, BookOpen, CalendarClock, GraduationCap, Settings, Users } from "lucide-react";
import WorkspacePage from "../../components/workspace/WorkspacePage";

const configurations = {
  employees: {
    icon: <Users size={20} />, eyebrow: "Team management", title: "Employees", description: "Manage counsellors, managers and their workload from one workspace.", primaryLabel: "Add employee", stats: [
      { label: "Total employees", value: "24", helper: "Across 5 departments", icon: <Users size={20} />, tone: "blue" }, { label: "Active today", value: "19", helper: "79% availability", icon: <Users size={20} />, tone: "green" }, { label: "Counsellors", value: "16", helper: "Lead handling team", icon: <Users size={20} />, tone: "purple" }, { label: "On leave", value: "2", helper: "Needs coverage", icon: <CalendarClock size={20} />, tone: "amber" },
    ], tabs: ["All", "Active", "Counsellors", "Managers", "On leave"], columns: [{ key:"name", label:"Employee", highlight:true }, { key:"department", label:"Department" }, { key:"role", label:"Role", badge:true }, { key:"leads", label:"Active leads" }, { key:"status", label:"Status", badge:true }], rows: [
      { name:"Riya Sharma", department:"Design & Creative", role:"Counsellor", leads:"32", status:"Active" }, { name:"Arjun Mehta", department:"Marketing", role:"Counsellor", leads:"27", status:"Active" }, { name:"Neha Gupta", department:"Management", role:"Manager", leads:"—", status:"Active" }, { name:"Vikram Singh", department:"Technology", role:"Counsellor", leads:"19", status:"On leave" },
    ],
  },
  followups: {
    eyebrow:"Activity management", title:"Follow-ups", description:"Track every call, WhatsApp conversation, email, and meeting due for your lead team.", primaryLabel:"Schedule follow-up", stats:[
      { label:"Due today", value:"38", helper:"12 due in next 2 hours", icon:<CalendarClock size={20}/>, tone:"amber" }, { label:"Completed today", value:"54", helper:"+18% vs yesterday", icon:<BarChart3 size={20}/>, tone:"green" }, { label:"Overdue", value:"7", helper:"Needs immediate action", icon:<CalendarClock size={20}/>, tone:"red" }, { label:"Upcoming", value:"126", helper:"Next 7 days", icon:<CalendarClock size={20}/>, tone:"purple" },
    ], tabs:["All", "Due today", "Overdue", "Upcoming", "Completed"], columns:[{key:"lead",label:"Lead",highlight:true},{key:"type",label:"Activity"},{key:"owner",label:"Counsellor"},{key:"due",label:"Due at"},{key:"status",label:"Status",badge:true}], rows:[
      {lead:"Aarav Kapoor",type:"Call",owner:"Riya Sharma",due:"Today, 11:30 AM",status:"Pending"},{lead:"Muskan Jain",type:"WhatsApp",owner:"Arjun Mehta",due:"Today, 01:00 PM",status:"Pending"},{lead:"Aditya Verma",type:"Meeting",owner:"Riya Sharma",due:"Yesterday, 04:30 PM",status:"Overdue"},{lead:"Ishita Roy",type:"Email",owner:"Vikram Singh",due:"Tomorrow, 10:00 AM",status:"Upcoming"},
    ],
  },
  admissions: {
    eyebrow:"Admissions workspace", title:"Admissions", description:"Move qualified leads through application, document verification and enrolment stages.", primaryLabel:"Create application", stats:[
      {label:"Applications",value:"82",helper:"Current intake",icon:<GraduationCap size={20}/>,tone:"blue"},{label:"Documents pending",value:"21",helper:"Awaiting applicant",icon:<BookOpen size={20}/>,tone:"amber"},{label:"Fee pending",value:"14",helper:"Follow-up required",icon:<CalendarClock size={20}/>,tone:"red"},{label:"Enrolled",value:"47",helper:"This intake",icon:<GraduationCap size={20}/>,tone:"green"},
    ], tabs:["All", "Application started", "Documents pending", "Fee pending", "Enrolled"], columns:[{key:"applicant",label:"Applicant",highlight:true},{key:"course",label:"Course"},{key:"counsellor",label:"Counsellor"},{key:"updated",label:"Last updated"},{key:"status",label:"Stage",badge:true}], rows:[
      {applicant:"Aarav Kapoor",course:"UI/UX Design",counsellor:"Riya Sharma",updated:"Today",status:"Documents pending"},{applicant:"Muskan Jain",course:"Digital Marketing",counsellor:"Arjun Mehta",updated:"Today",status:"Fee pending"},{applicant:"Kunal Das",course:"Data Analytics",counsellor:"Vikram Singh",updated:"Yesterday",status:"Application started"},{applicant:"Sana Ali",course:"Graphic Design",counsellor:"Riya Sharma",updated:"02 Aug",status:"Enrolled"},
    ],
  },
  students: {
    eyebrow:"Student records", title:"Students", description:"A single place for enrolled learner profiles, courses, batches and fee status.", primaryLabel:"Add student", stats:[
      {label:"Active students",value:"468",helper:"Across all programs",icon:<Users size={20}/>,tone:"blue"},{label:"New this month",value:"47",helper:"Current intake",icon:<GraduationCap size={20}/>,tone:"green"},{label:"Fee due",value:"29",helper:"Needs reminder",icon:<CalendarClock size={20}/>,tone:"red"},{label:"Programs",value:"18",helper:"Active course offerings",icon:<BookOpen size={20}/>,tone:"purple"},
    ], tabs:["All", "Active", "Fee due", "On hold", "Completed"], columns:[{key:"student",label:"Student",highlight:true},{key:"course",label:"Course"},{key:"batch",label:"Batch"},{key:"fee",label:"Fee status",badge:true},{key:"status",label:"Status",badge:true}], rows:[
      {student:"Sana Ali",course:"Graphic Design",batch:"GD-26-A",fee:"Paid",status:"Active"},{student:"Rohan Shah",course:"Digital Marketing",batch:"DM-26-B",fee:"Pending",status:"Active"},{student:"Meera Nair",course:"UI/UX Design",batch:"UX-26-A",fee:"Paid",status:"Completed"},{student:"Kabir Khan",course:"Data Analytics",batch:"DA-26-A",fee:"Pending",status:"On hold"},
    ],
  },
  reports: {
    eyebrow:"Business intelligence", title:"Reports", description:"Monitor lead volume, campaign quality, counsellor conversion, and admissions performance.", primaryLabel:"Create report", secondaryLabel:"Download report", stats:[
      {label:"Lead conversion",value:"18.6%",helper:"+2.4% this month",icon:<BarChart3 size={20}/>,tone:"green"},{label:"Cost per lead",value:"₹184",helper:"Across active campaigns",icon:<BarChart3 size={20}/>,tone:"blue"},{label:"First response",value:"14 min",helper:"Target: under 15 min",icon:<CalendarClock size={20}/>,tone:"purple"},{label:"Follow-up SLA",value:"86%",helper:"7 overdue follow-ups",icon:<CalendarClock size={20}/>,tone:"amber"},
    ], tabs:["Saved reports", "Lead reports", "Campaigns", "Counsellors"], columns:[{key:"report",label:"Report",highlight:true},{key:"category",label:"Category"},{key:"owner",label:"Created by"},{key:"updated",label:"Updated"},{key:"status",label:"Availability",badge:true}], rows:[
      {report:"Weekly lead funnel",category:"Lead performance",owner:"Admin",updated:"Today",status:"Active"},{report:"Counsellor conversion",category:"Team performance",owner:"Admin",updated:"Yesterday",status:"Active"},{report:"July campaign ROI",category:"Campaigns",owner:"Marketing",updated:"01 Aug",status:"Active"},{report:"Admission intake summary",category:"Admissions",owner:"Admin",updated:"28 Jul",status:"Active"},
    ],
  },
};

const AdminWorkspace = ({ page }) => <WorkspacePage {...configurations[page]} />;
export default AdminWorkspace;
