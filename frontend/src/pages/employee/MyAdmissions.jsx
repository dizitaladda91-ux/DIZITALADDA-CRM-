import { FileCheck2, GraduationCap, IndianRupee, Upload } from "lucide-react";
import WorkspacePage from "../../components/workspace/WorkspacePage";

const MyAdmissions = () => <WorkspacePage eyebrow="Counsellor workspace" title="My Admissions" description="Manage applicants you are guiding from application through enrolment." primaryLabel="Start application" secondaryLabel="Export list" stats={[
  {label:"My applications",value:"14",helper:"Current intake",icon:<GraduationCap size={20}/>,tone:"blue"},{label:"Documents pending",value:"5",helper:"Awaiting applicant",icon:<Upload size={20}/>,tone:"amber"},{label:"Fee pending",value:"3",helper:"Follow-up required",icon:<IndianRupee size={20}/>,tone:"red"},{label:"Enrolled",value:"6",helper:"This intake",icon:<FileCheck2 size={20}/>,tone:"green"},
]} tabs={["All", "Documents pending", "Fee pending", "Enrolled"]} columns={[{key:"applicant",label:"Applicant",highlight:true},{key:"course",label:"Course"},{key:"updated",label:"Last updated"},{key:"next",label:"Next action"},{key:"status",label:"Stage",badge:true}]} rows={[
  {applicant:"Aarav Kapoor",course:"UI/UX Design",updated:"Today",next:"Request marksheet",status:"Documents pending"},{applicant:"Muskan Jain",course:"Digital Marketing",updated:"Today",next:"Fee reminder call",status:"Fee pending"},{applicant:"Kunal Das",course:"Data Analytics",updated:"Yesterday",next:"Review form",status:"Application started"},{applicant:"Sana Ali",course:"Graphic Design",updated:"02 Aug",next:"Welcome call",status:"Enrolled"},
]} />;
export default MyAdmissions;
