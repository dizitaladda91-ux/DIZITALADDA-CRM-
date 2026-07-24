import { useState } from "react";

import Modal from "../common/Modal/Modal";

import "../../styles/LeadManagement/LeadAssignmentModal.css";

import {
    Users,
    UserCheck,
} from "lucide-react";

const LeadAssignmentModal = ({

    open,

    loading = false,

    selectedLeads = [],

    employees = [],

    onClose,

    onAssign,

}) => {

    const [employeeId, setEmployeeId] = useState("");

    const [assignmentType, setAssignmentType] = useState("MANUAL");

    const [priority, setPriority] = useState("NORMAL");

    const [note, setNote] = useState("");

    const handleSubmit = () => {

        if (!employeeId) return;

        onAssign({

            employee_id: employeeId,

            assignment_type: assignmentType,

            priority,

            note,

            lead_ids: selectedLeads,

        });

    };

    return (

        <Modal

            open={open}

            title="Assign Leads"

            subtitle="Assign selected leads to an employee"

            size="lg"

            loading={loading}

            onClose={onClose}

        >

            <div className="assignment-summary">

                <Users size={24}/>

                <div>

                    <h3>

                        {selectedLeads.length}

                    </h3>

                    <p>

                        Leads Selected

                    </p>

                </div>

            </div>

            <div className="assignment-form">

                <div className="form-group">

                    <label>

                        Employee

                    </label>

                    <select

                        value={employeeId}

                        onChange={(e)=>

                            setEmployeeId(e.target.value)

                        }

                    >

                        <option value="">

                            Select Employee

                        </option>

                        {

                            employees.map((employee)=>(

                                <option

                                    key={employee.id}

                                    value={employee.id}

                                >

                                    {employee.full_name}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="form-group">

                    <label>

                        Assignment Type

                    </label>

                    <select

                        value={assignmentType}

                        onChange={(e)=>

                            setAssignmentType(e.target.value)

                        }

                    >

                        <option value="MANUAL">

                            Manual

                        </option>

                        <option value="ROUND_ROBIN">

                            Round Robin

                        </option>

                    </select>

                </div>

                <div className="form-group">

                    <label>

                        Priority

                    </label>

                    <select

                        value={priority}

                        onChange={(e)=>

                            setPriority(e.target.value)

                        }

                    >

                        <option value="LOW">

                            Low

                        </option>

                        <option value="NORMAL">

                            Normal

                        </option>

                        <option value="HIGH">

                            High

                        </option>

                    </select>

                </div>

                <div className="form-group">

                    <label>

                        Assignment Note

                    </label>

                    <textarea

                        rows="4"

                        value={note}

                        onChange={(e)=>

                            setNote(e.target.value)

                        }

                        placeholder="Write note..."

                    />

                </div>

            </div>

            <div className="assignment-footer">

                <button

                    className="cancel-btn"

                    onClick={onClose}

                >

                    Cancel

                </button>

                <button

                    className="assign-btn"

                    disabled={!employeeId || loading}

                    onClick={handleSubmit}

                >

                    <UserCheck size={18}/>

                    Assign Leads

                </button>

            </div>

        </Modal>

    );

};

export default LeadAssignmentModal;