import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../css/index.css";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enrollments");
      const data = await res.json();
      // Show pending first
      const sorted = data.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setEnrollments(sorted);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/enrollments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchEnrollments();
      } else {
        const errorData = await res.json();
        alert(`Failed to update: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h1>Enrollment Requests</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>Review and approve student enrollment requests.</p>

        {loading ? (
          <div>Loading requests...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="grades-table" style={{ minWidth: "800px" }}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Section</th>
                  <th>Date Requested</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.student_name}</strong>
                      <br /><small>{req.student_email}</small>
                    </td>
                    <td>{req.subject_code}<br /><small>{req.subject_description}</small></td>
                    <td>{req.section_name || 'TBA'}</td>
                    <td>{new Date(req.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${req.status === 'enrolled' ? 'passed' : req.status === 'rejected' ? 'failed' : 'progress'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {req.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: "5px 10px", marginRight: "10px", fontSize: "12px" }}
                            onClick={() => updateStatus(req.id, 'enrolled')}
                          >
                            Accept
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: "5px 10px", fontSize: "12px" }}
                            onClick={() => updateStatus(req.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No enrollment requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
