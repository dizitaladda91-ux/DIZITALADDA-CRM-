import "./RecentLeadsTable.css";

import { useNavigate } from "react-router-dom";

const RecentLeadsTable = ({ leads = [] }) => {
    const navigate = useNavigate();
    return (
        <div className="recent-leads-card">

            <div className="recent-leads-header">
                <h3>Recent Leads</h3>

                <button
    className="view-all-btn"
    onClick={() => navigate("/employee/my-leads")}
>
    View All
</button>
            </div>

            <div className="table-responsive">

                <table className="recent-leads-table">

                    <thead>
                        <tr>
                            <th>Lead</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th>Follow-up</th>
                        </tr>
                    </thead>

                    <tbody>

                        {leads.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="4"
                                    className="empty-row"
                                >
                                    No Recent Leads Found
                                </td>
                            </tr>

                        ) : (

                            leads.map((lead) => (

                                <tr key={lead.id}>

                                    <td>{lead.full_name}</td>

                                    <td>
                                        {maskPhone(lead.mobile)}
                                    </td>

                                    <td>
                                        <span
                                            className={`status ${lead.status
                                                ?.toLowerCase()
                                                ?.replace(/\s+/g, "_")}`}
                                        >
                                            {lead.status}
                                        </span>
                                    </td>

                                    <td>
                                        {lead.next_followup || "-"}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default RecentLeadsTable;