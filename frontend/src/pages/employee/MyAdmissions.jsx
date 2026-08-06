import { FileCheck2, GraduationCap, IndianRupee, Upload } from "lucide-react";
import WorkspacePage from "../../components/workspace/WorkspacePage";

const MyAdmissions = () => <WorkspacePage eyebrow="Counsellor workspace" title="My Admissions" description="Manage applicants you are guiding from application through enrolment." primaryLabel="Start application" secondaryLabel="Export list" stats={[
  {label:"My applications",value:"—",helper:"Database data will appear here",icon:<GraduationCap size={20}/>,tone:"blue"},{label:"Documents pending",value:"—",helper:"Database data will appear here",icon:<Upload size={20}/>,tone:"amber"},{label:"Fee pending",value:"—",helper:"Database data will appear here",icon:<IndianRupee size={20}/>,tone:"red"},{label:"Enrolled",value:"—",helper:"Database data will appear here",icon:<FileCheck2 size={20}/>,tone:"green"},
]} tabs={["All", "Documents pending", "Fee pending", "Enrolled"]} columns={[{key:"applicant",label:"Applicant",highlight:true},{key:"course",label:"Course"},{key:"updated",label:"Last updated"},{key:"next",label:"Next action"},{key:"status",label:"Stage",badge:true}]} rows={[]} />;
export default MyAdmissions;
