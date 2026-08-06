import { BarChart3, BookOpen, CalendarClock, GraduationCap, Settings, Users } from "lucide-react";
import WorkspacePage from "../../components/workspace/WorkspacePage";

const configurations = {
  followups: {
    eyebrow:"Activity management", title:"Follow-ups", description:"Track every call, WhatsApp conversation, email, and meeting due for your lead team.", primaryLabel:"Schedule follow-up", stats:[
      { label:"Due today", value:"—", helper:"Database data will appear here", icon:<CalendarClock size={20}/>, tone:"amber" }, { label:"Completed today", value:"—", helper:"Database data will appear here", icon:<BarChart3 size={20}/>, tone:"green" }, { label:"Overdue", value:"—", helper:"Database data will appear here", icon:<CalendarClock size={20}/>, tone:"red" }, { label:"Upcoming", value:"—", helper:"Database data will appear here", icon:<CalendarClock size={20}/>, tone:"purple" },
    ], tabs:["All", "Due today", "Overdue", "Upcoming", "Completed"], columns:[{key:"lead",label:"Lead",highlight:true},{key:"type",label:"Activity"},{key:"owner",label:"Counsellor"},{key:"due",label:"Due at"},{key:"status",label:"Status",badge:true}], rows:[],
  },
  admissions: {
    eyebrow:"Admissions workspace", title:"Admissions", description:"Move qualified leads through application, document verification and enrolment stages.", primaryLabel:"Create application", stats:[
      {label:"Applications",value:"—",helper:"Database data will appear here",icon:<GraduationCap size={20}/>,tone:"blue"},{label:"Documents pending",value:"—",helper:"Database data will appear here",icon:<BookOpen size={20}/>,tone:"amber"},{label:"Fee pending",value:"—",helper:"Database data will appear here",icon:<CalendarClock size={20}/>,tone:"red"},{label:"Enrolled",value:"—",helper:"Database data will appear here",icon:<GraduationCap size={20}/>,tone:"green"},
    ], tabs:["All", "Application started", "Documents pending", "Fee pending", "Enrolled"], columns:[{key:"applicant",label:"Applicant",highlight:true},{key:"course",label:"Course"},{key:"counsellor",label:"Counsellor"},{key:"updated",label:"Last updated"},{key:"status",label:"Stage",badge:true}], rows:[],
  },
  students: {
    eyebrow:"Student records", title:"Students", description:"A single place for enrolled learner profiles, courses, batches and fee status.", primaryLabel:"Add student", stats:[
      {label:"Active students",value:"—",helper:"Database data will appear here",icon:<Users size={20}/>,tone:"blue"},{label:"New this month",value:"—",helper:"Database data will appear here",icon:<GraduationCap size={20}/>,tone:"green"},{label:"Fee due",value:"—",helper:"Database data will appear here",icon:<CalendarClock size={20}/>,tone:"red"},{label:"Programs",value:"—",helper:"Database data will appear here",icon:<BookOpen size={20}/>,tone:"purple"},
    ], tabs:["All", "Active", "Fee due", "On hold", "Completed"], columns:[{key:"student",label:"Student",highlight:true},{key:"course",label:"Course"},{key:"batch",label:"Batch"},{key:"fee",label:"Fee status",badge:true},{key:"status",label:"Status",badge:true}], rows:[],
  },
  reports: {
    eyebrow:"Business intelligence", title:"Reports", description:"Monitor lead volume, campaign quality, counsellor conversion, and admissions performance.", primaryLabel:"Create report", secondaryLabel:"Download report", stats:[
      {label:"Lead conversion",value:"—",helper:"Database data will appear here",icon:<BarChart3 size={20}/>,tone:"green"},{label:"Cost per lead",value:"—",helper:"Database data will appear here",icon:<BarChart3 size={20}/>,tone:"blue"},{label:"First response",value:"—",helper:"Database data will appear here",icon:<CalendarClock size={20}/>,tone:"purple"},{label:"Follow-up SLA",value:"—",helper:"Database data will appear here",icon:<CalendarClock size={20}/>,tone:"amber"},
    ], tabs:["Saved reports", "Lead reports", "Campaigns", "Counsellors"], columns:[{key:"report",label:"Report",highlight:true},{key:"category",label:"Category"},{key:"owner",label:"Created by"},{key:"updated",label:"Updated"},{key:"status",label:"Availability",badge:true}], rows:[],
  },
};

const AdminWorkspace = ({ page }) => <WorkspacePage {...configurations[page]} />;
export default AdminWorkspace;
