import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../css/Homepage.css";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user")) || { id: 1, full_name: "User" };
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setFormData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProfile({ full_name: user.full_name || "Unknown User", student_type: "regular" });
        setLoading(false);
      });
  }, [user.id]);

  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`/api/users/${user.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setProfile(formData);
        setIsEditing(false);
        setSaveMessage("Profile saved successfully! ✅");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        const data = await res.json();
        alert("Failed to save: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div style={{ padding: "40px", textAlign: "center" }}>Loading Profile...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div style={{ margin: "20px", background: "var(--white)", borderRadius: "var(--radius)", padding: "30px", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--orange-100)", paddingBottom: "20px", marginBottom: "20px" }}>
          <h2 style={{ color: "var(--orange-800)", fontSize: "1.5rem", fontWeight: "700" }}>👤 My Profile</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {saveMessage && <span style={{ color: "green", fontWeight: "bold" }}>{saveMessage}</span>}
            {!isEditing ? (
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
            ) : (
              <button className="btn btn-primary" style={{ background: "var(--orange-500)", color: "white" }} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            )}
          </div>
        </div>

        <div className="profile-card-lg">
          <div className="avatar-xl">{profile.full_name.substring(0, 2).toUpperCase()}</div>
          {isEditing ? (
            <input 
              type="text" 
              value={formData.full_name || ""} 
              onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
              style={{ fontSize: '1.5em', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px', width: '100%', maxWidth: '300px', padding: '8px', border: '2px solid var(--orange-200)', borderRadius: '8px' }} 
            />
          ) : (
            <h3>{profile.full_name}</h3>
          )}
          <p className="subtitle">{profile.student_type ? profile.student_type.toUpperCase() : 'STUDENT'}</p>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Program</label>
            {isEditing ? <input value={formData.program || ""} onChange={e => setFormData({ ...formData, program: e.target.value })} style={{ padding: '8px', border: '2px solid var(--orange-200)', borderRadius: '4px' }} /> : <span>{profile.program || 'Not set'}</span>}
          </div>
          <div className="info-item">
            <label>Contact</label>
            {isEditing ? <input value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ padding: '8px', border: '2px solid var(--orange-200)', borderRadius: '4px' }} /> : <span>{profile.phone || 'Not set'}</span>}
          </div>
          <div className="info-item">
            <label>Email</label>
            <span>{profile.email}</span>
          </div>
          <div className="info-item">
            <label>Address</label>
            {isEditing ? <input value={formData.address || ""} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ padding: '8px', border: '2px solid var(--orange-200)', borderRadius: '4px' }} /> : <span>{profile.address || 'Not set'}</span>}
          </div>
          <div className="info-item">
            <label>Date of Birth</label>
            {isEditing ? <input type="date" value={formData.dob ? formData.dob.split('T')[0] : ""} onChange={e => setFormData({ ...formData, dob: e.target.value })} style={{ padding: '8px', border: '2px solid var(--orange-200)', borderRadius: '4px' }} /> : <span>{profile.dob ? profile.dob.split('T')[0] : 'Not set'}</span>}
          </div>
          {profile.student_type === 'transferee' && (
            <>
              <div className="info-item">
                <label>Last School</label>
                {isEditing ? <input value={formData.last_school || ""} onChange={e => setFormData({ ...formData, last_school: e.target.value })} style={{ padding: '8px', border: '2px solid var(--orange-200)', borderRadius: '4px' }} /> : <span>{profile.last_school || 'Not set'}</span>}
              </div>
              <div className="info-item">
                <label>Current Level</label>
                {isEditing ? <input value={formData.current_level || ""} onChange={e => setFormData({ ...formData, current_level: e.target.value })} style={{ padding: '8px', border: '2px solid var(--orange-200)', borderRadius: '4px' }} /> : <span>{profile.current_level || 'Not set'}</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
