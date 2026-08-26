import React, { useEffect, useState, useCallback } from "react";
import "./MyLeads.css";
import MyLeadsHeader from "../../components/employee/myLeads/MyLeadsHeader/MyLeadsHeader";
import SearchFilterBar from "../../components/employee/myLeads/SearchFilterBar/SearchFilterBar";
import LeadsTable from "../../components/employee/myLeads/LeadsTable/LeadsTable";
import { getMyLeads } from "../../services/employeeLeadService";

const MyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live Active Filter State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [source, setSource] = useState("ALL");

  const fetchMyLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status !== "ALL") params.status = status;
      if (priority !== "ALL") params.priority = priority;
      if (source !== "ALL") params.source = source;

      const response = await getMyLeads(params);
      const list = response?.data?.leads || response?.leads || response?.data || [];
      setLeads(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, source]);

  useEffect(() => {
    fetchMyLeads();
  }, [fetchMyLeads]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPriority("ALL");
    setSource("ALL");
  };

  return (
    <div className="my-leads-page">
      <MyLeadsHeader />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        source={source}
        onSourceChange={setSource}
        onReset={handleResetFilters}
      />

      <LeadsTable
        leads={leads}
        loading={loading}
        onRefresh={fetchMyLeads}
      />
    </div>
  );
};

export default MyLeads;