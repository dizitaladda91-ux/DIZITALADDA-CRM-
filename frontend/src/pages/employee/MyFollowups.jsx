import { CalendarCheck2, Clock3, PhoneCall, TimerReset } from "lucide-react";
import WorkspacePage from "../../components/workspace/WorkspacePage";

const MyFollowups = () => <WorkspacePage eyebrow="Counsellor workspace" title="My Follow-ups" description="Plan your conversations, complete outcomes and never miss a student callback." primaryLabel="Add follow-up" stats={[
  {label:"Due today",value:"8",helper:"3 in the next 2 hours",icon:<Clock3 size={20}/>,tone:"amber"},{label:"Completed",value:"12",helper:"Today",icon:<CalendarCheck2 size={20}/>,tone:"green"},{label:"Overdue",value:"1",helper:"Complete immediately",icon:<TimerReset size={20}/>,tone:"red"},{label:"This week",value:"31",helper:"Scheduled activities",icon:<PhoneCall size={20}/>,tone:"purple"},
]} tabs={["All", "Due today", "Overdue", "Upcoming", "Completed"]} columns={[{key:"lead",label:"Lead",highlight:true},{key:"course",label:"Interested course"},{key:"activity",label:"Activity"},{key:"due",label:"Due at"},{key:"status",label:"Status",badge:true}]} rows={[
  {lead:"Aarav Kapoor",course:"UI/UX Design",activity:"Call",due:"Today, 11:30 AM",status:"Pending"},{lead:"Muskan Jain",course:"Digital Marketing",activity:"WhatsApp",due:"Today, 01:00 PM",status:"Pending"},{lead:"Aditya Verma",course:"Data Analytics",activity:"Call",due:"Yesterday, 04:30 PM",status:"Overdue"},{lead:"Ishita Roy",course:"Graphic Design",activity:"Email",due:"Tomorrow, 10:00 AM",status:"Upcoming"},
]} />;
export default MyFollowups;
