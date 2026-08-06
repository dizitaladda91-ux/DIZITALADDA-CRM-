import { CalendarCheck2, Clock3, PhoneCall, TimerReset } from "lucide-react";
import WorkspacePage from "../../components/workspace/WorkspacePage";

const MyFollowups = () => <WorkspacePage eyebrow="Counsellor workspace" title="My Follow-ups" description="Plan your conversations, complete outcomes and never miss a student callback." primaryLabel="Add follow-up" stats={[
  {label:"Due today",value:"—",helper:"Database data will appear here",icon:<Clock3 size={20}/>,tone:"amber"},{label:"Completed",value:"—",helper:"Database data will appear here",icon:<CalendarCheck2 size={20}/>,tone:"green"},{label:"Overdue",value:"—",helper:"Database data will appear here",icon:<TimerReset size={20}/>,tone:"red"},{label:"This week",value:"—",helper:"Database data will appear here",icon:<PhoneCall size={20}/>,tone:"purple"},
]} tabs={["All", "Due today", "Overdue", "Upcoming", "Completed"]} columns={[{key:"lead",label:"Lead",highlight:true},{key:"course",label:"Interested course"},{key:"activity",label:"Activity"},{key:"due",label:"Due at"},{key:"status",label:"Status",badge:true}]} rows={[]} />;
export default MyFollowups;
