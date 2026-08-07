import { CalendarCheck2, Clock3, PhoneCall, TimerReset } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import WorkspacePage from "../../components/workspace/WorkspacePage";
import { getFollowups } from "../../services/followupService";

const MyFollowups = () => {
  const [followups, setFollowups] = useState([]); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { try { setLoading(true); const response = await getFollowups({ limit: 100 }); setFollowups(response?.data?.data || []); } catch (error) { toast.error(error?.response?.data?.message || "Could not load follow-ups."); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const stats = useMemo(() => { const now = new Date(); const pending = followups.filter((item) => item.status === "PENDING"); const dueToday = pending.filter((item) => new Date(item.next_followup_at).toDateString() === now.toDateString()).length; const overdue = pending.filter((item) => new Date(item.next_followup_at) < now).length; return { dueToday, overdue, completed: followups.filter((item) => item.status === "COMPLETED").length, upcoming: pending.length }; }, [followups]);
  const rows = followups.map((item) => ({ id: item.id, lead: item.lead_name, course: item.interested_course || "—", activity: item.followup_type, due: item.next_followup_at ? new Date(item.next_followup_at).toLocaleString("en-IN") : "—", status: item.status }));
  return <WorkspacePage eyebrow="Counsellor workspace" title="My Follow-ups" description="Plan your conversations, complete outcomes and never miss a student callback." primaryLabel="Add follow-up" stats={[
    {label:"Due today",value:loading ? "—" : stats.dueToday,helper:"From database",icon:<Clock3 size={20}/>,tone:"amber"},{label:"Completed",value:loading ? "—" : stats.completed,helper:"From database",icon:<CalendarCheck2 size={20}/>,tone:"green"},{label:"Overdue",value:loading ? "—" : stats.overdue,helper:"Needs action",icon:<TimerReset size={20}/>,tone:"red"},{label:"Upcoming",value:loading ? "—" : stats.upcoming,helper:"Pending follow-ups",icon:<PhoneCall size={20}/>,tone:"purple"},
  ]} tabs={["All", "Pending", "Completed"]} columns={[{key:"lead",label:"Lead",highlight:true},{key:"course",label:"Interested course"},{key:"activity",label:"Activity"},{key:"due",label:"Due at"},{key:"status",label:"Status",badge:true}]} rows={rows} />;
};

export default MyFollowups;
