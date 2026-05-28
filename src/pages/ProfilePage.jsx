import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../css/Homepage.css";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    id: 1,
    full_name: "User",
  };
  const [profile, setProfile] = useState(null);

  // State Tracking
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Refs for hidden file inputs
  const profilePicRef = useRef(null);
  const signatureRef = useRef(null);
  const docRefs = {
    birth_cert: useRef(null),
    form_138: useRef(null),
    good_moral: useRef(null),
  };

  useEffect(() => {
    fetch(`/api/users/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const enrichedData = {
          student_id: "2024-01234",
          enrollment_status: "Officially Enrolled",
          curriculum_year: "2023-2024",
          email_alerts: true,
          sms_alerts: false,
          google_linked: true,
          ...data,
        };
        setProfile(enrichedData);
        setFormData(enrichedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProfile({
          full_name: user.full_name || "Unknown User",
          student_type: "regular",
        });
        setLoading(false);
      });
  }, [user.id]);

  // --- Handlers ---
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (section) => {
    if (section === "personal") {
      if (!formData.profile_picture)
        return alert("A profile picture is required.");
      if (
        !formData.program?.trim() ||
        !formData.phone?.trim() ||
        !formData.address?.trim()
      ) {
        return alert("Program, Contact, and Address cannot be empty.");
      }
    }
    if (section === "requirements") {
      if (
        !formData.emergency_contact_name?.trim() ||
        !formData.emergency_contact_phone?.trim()
      ) {
        return alert("Emergency contact information cannot be empty.");
      }
      if (!formData.blood_type?.trim())
        return alert("Please select a blood type.");
      if (!formData.signature_image)
        return alert("A signature image is required.");
    }
    if (section === "security") {
      if (passwords.new !== passwords.confirm)
        return alert("New passwords do not match.");
      if (passwords.new.length < 8)
        return alert("Password must be at least 8 characters.");
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const res = await fetch(`/api/users/${user.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setProfile(formData);
        setEditingSection(null);
        if (section === "security")
          setPasswords({ current: "", new: "", confirm: "" });
        setSaveMessage(`Changes saved successfully! ✅`);
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

  const cancelEdit = () => {
    setFormData(profile);
    setPasswords({ current: "", new: "", confirm: "" });
    setEditingSection(null);
  };

  // --- Calculations ---
  const calculateProgress = () => {
    if (!profile) return 0;
    const requiredFields = [
      "profile_picture",
      "program",
      "phone",
      "address",
      "emergency_contact_name",
      "emergency_contact_phone",
      "blood_type",
      "signature_image",
    ];
    const filledFields = requiredFields.filter(
      (field) => profile[field] && profile[field].trim() !== "",
    ).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  if (loading)
    return (
      <DashboardLayout>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--orange-800)",
            fontWeight: "bold",
          }}
        >
          Loading Student Hub...
        </div>
      </DashboardLayout>
    );

  const progress = calculateProgress();

  // Shared Card Style
  const cardStyle = {
    background: "var(--white)",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f0f0f0",
    marginBottom: "20px",
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
        {saveMessage && (
          <div
            style={{
              background: "#d4edda",
              color: "#155724",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
              border: "1px solid #c3e6cb",
              marginBottom: "20px",
            }}
          >
            {saveMessage}
          </div>
        )}

        {/* --- TWO COLUMN LAYOUT --- */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "25px" }}>
          {/* ================= LEFT COLUMN: OVERVIEW & STATUS ================= */}
          <div
            style={{
              flex: "1 1 350px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 1. PROFILE SUMMARY & PROGRESS (Integrated) */}
            <div
              style={{
                ...cardStyle,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderTop: "4px solid var(--orange-500)",
              }}
            >
              <div
                style={{
                  overflow: "hidden",
                  position: "relative",
                  cursor: editingSection === "personal" ? "pointer" : "default",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "var(--orange-100)",
                  color: "var(--orange-800)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  border: "3px solid white",
                }}
                onClick={() =>
                  editingSection === "personal" && profilePicRef.current.click()
                }
              >
                {formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                    {profile.full_name.substring(0, 2).toUpperCase()}
                  </span>
                )}
                {editingSection === "personal" && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      background: "rgba(234, 88, 12, 0.8)",
                      color: "white",
                      width: "100%",
                      textAlign: "center",
                      fontSize: "0.8rem",
                      padding: "6px 0",
                      fontWeight: "bold",
                    }}
                  >
                    UPLOAD
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={profilePicRef}
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e, "profile_picture")}
              />

              <h3
                style={{
                  marginTop: "15px",
                  marginBottom: "2px",
                  color: "#333",
                  fontSize: "1.4rem",
                }}
              >
                {profile.full_name}
              </h3>
              <p
                style={{
                  color: "var(--orange-600)",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  marginBottom: "25px",
                }}
              >
                {profile.student_type || "STUDENT"}
              </p>

              {/* Compact Progress Bar */}
              <div
                style={{
                  width: "100%",
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#555",
                    }}
                  >
                    Profile Completion
                  </span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      color: progress === 100 ? "#28a745" : "var(--orange-600)",
                    }}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    background: "#e9ecef",
                    borderRadius: "10px",
                    height: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      background:
                        progress === 100 ? "#28a745" : "var(--orange-500)",
                      height: "100%",
                      transition: "width 0.4s ease",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 2. ACADEMIC STATUS (READ-ONLY) */}
            <div style={cardStyle}>
              <h2
                style={{
                  color: "var(--orange-800)",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  borderBottom: "2px solid var(--orange-100)",
                  paddingBottom: "10px",
                  marginBottom: "15px",
                }}
              >
                🎓 Academic Status
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Official Student ID
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#333",
                    }}
                  >
                    {profile.student_id || "PENDING"}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Enrollment Status
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      background:
                        profile.enrollment_status === "Officially Enrolled"
                          ? "#d4edda"
                          : "#fff3cd",
                      color:
                        profile.enrollment_status === "Officially Enrolled"
                          ? "#155724"
                          : "#856404",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      display: "inline-block",
                    }}
                  >
                    {profile.enrollment_status || "Not Enrolled"}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Curriculum Year
                  </span>
                  <span style={{ fontWeight: "500", color: "#333" }}>
                    {profile.curriculum_year || "Not Assigned"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. SECURITY & PREFERENCES */}
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid var(--orange-100)",
                  paddingBottom: "10px",
                  marginBottom: "15px",
                }}
              >
                <h2
                  style={{
                    color: "var(--orange-800)",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    margin: 0,
                  }}
                >
                  🛡️ Security
                </h2>
                {editingSection !== "security" ? (
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                    onClick={() => setEditingSection("security")}
                    disabled={editingSection !== null}
                  >
                    Edit
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                      onClick={cancelEdit}
                    >
                      X
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{
                        padding: "4px 8px",
                        fontSize: "0.8rem",
                        background: "var(--orange-500)",
                        color: "white",
                      }}
                      onClick={() => handleSave("security")}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <h3
                style={{
                  fontSize: "0.9rem",
                  color: "#555",
                  marginBottom: "10px",
                }}
              >
                Change Password
              </h3>
              {editingSection === "security" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              ) : (
                <p
                  style={{
                    color: "#888",
                    fontSize: "0.85rem",
                    marginBottom: "20px",
                  }}
                >
                  ********
                </p>
              )}

              <h3
                style={{
                  fontSize: "0.9rem",
                  color: "#555",
                  marginBottom: "10px",
                }}
              >
                Linked Accounts
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>🇬</span>
                <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                  Google Account
                </span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: profile.google_linked ? "#d4edda" : "#e2e3e5",
                    color: profile.google_linked ? "#155724" : "#383d41",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    marginLeft: "auto",
                  }}
                >
                  {profile.google_linked ? "Linked" : "Not Linked"}
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: DATA ENTRY & VAULT ================= */}
          <div
            style={{
              flex: "2 1 600px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 4. HIGHLIGHTED PERSONAL INFORMATION */}
            <div
              style={{
                ...cardStyle,
                background:
                  "linear-gradient(to bottom right, #fffaf0, #ffffff)",
                border: "1px solid #ffe8cc",
                borderTop: "4px solid var(--orange-500)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid rgba(234, 88, 12, 0.1)",
                  paddingBottom: "15px",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    color: "var(--orange-800)",
                    fontSize: "1.3rem",
                    fontWeight: "800",
                    margin: 0,
                  }}
                >
                  📋 Personal Information
                </h2>
                <div style={{ display: "flex", gap: "10px" }}>
                  {editingSection !== "personal" ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingSection("personal")}
                      disabled={editingSection !== null}
                    >
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{
                          background: "var(--orange-500)",
                          color: "white",
                        }}
                        onClick={() => handleSave("personal")}
                        disabled={saving}
                      >
                        💾 Save Profile
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingSection === "personal" && (
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Full Name (Edit Mode)
                  </label>
                  <input
                    type="text"
                    value={formData.full_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    style={{
                      fontSize: "1.1em",
                      fontWeight: "bold",
                      width: "100%",
                      padding: "10px",
                      border: "2px solid var(--orange-200)",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              )}

              <div
                className="info-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                <div className="info-item">
                  <label
                    style={{ color: "var(--orange-800)", fontWeight: "600" }}
                  >
                    Program <span style={{ color: "red" }}>*</span>
                  </label>
                  {editingSection === "personal" ? (
                    <input
                      value={formData.program || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, program: e.target.value })
                      }
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "1.05rem" }}>
                      {profile.program || "Not set"}
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <label
                    style={{ color: "var(--orange-800)", fontWeight: "600" }}
                  >
                    Contact <span style={{ color: "red" }}>*</span>
                  </label>
                  {editingSection === "personal" ? (
                    <input
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "1.05rem" }}>
                      {profile.phone || "Not set"}
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <label
                    style={{ color: "var(--orange-800)", fontWeight: "600" }}
                  >
                    Email Address
                  </label>
                  <span style={{ fontSize: "1.05rem", color: "#555" }}>
                    {profile.email}
                  </span>
                </div>
                <div className="info-item">
                  <label
                    style={{ color: "var(--orange-800)", fontWeight: "600" }}
                  >
                    Date of Birth
                  </label>
                  {editingSection === "personal" ? (
                    <input
                      type="date"
                      value={formData.dob ? formData.dob.split("T")[0] : ""}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "1.05rem" }}>
                      {profile.dob ? profile.dob.split("T")[0] : "Not set"}
                    </span>
                  )}
                </div>
                <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{ color: "var(--orange-800)", fontWeight: "600" }}
                  >
                    Home Address <span style={{ color: "red" }}>*</span>
                  </label>
                  {editingSection === "personal" ? (
                    <input
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "1.05rem" }}>
                      {profile.address || "Not set"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 5. ID REQUIREMENTS */}
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid var(--orange-100)",
                  paddingBottom: "15px",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    color: "var(--orange-800)",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    margin: 0,
                  }}
                >
                  🪪 School ID Requirements
                </h2>
                <div style={{ display: "flex", gap: "10px" }}>
                  {editingSection !== "requirements" ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingSection("requirements")}
                      disabled={editingSection !== null}
                    >
                      ✏️ Edit Info
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{
                          background: "var(--orange-500)",
                          color: "white",
                        }}
                        onClick={() => handleSave("requirements")}
                        disabled={saving}
                      >
                        💾 Save Info
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div
                className="info-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                <div className="info-item">
                  <label>
                    Emergency Contact Person{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  {editingSection === "requirements" ? (
                    <input
                      value={formData.emergency_contact_name || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact_name: e.target.value,
                        })
                      }
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <span>{profile.emergency_contact_name || "Not set"}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>
                    Emergency Contact Number{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  {editingSection === "requirements" ? (
                    <input
                      value={formData.emergency_contact_phone || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact_phone: e.target.value,
                        })
                      }
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <span>{profile.emergency_contact_phone || "Not set"}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>
                    Blood Type <span style={{ color: "red" }}>*</span>
                  </label>
                  {editingSection === "requirements" ? (
                    <select
                      value={formData.blood_type || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, blood_type: e.target.value })
                      }
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        width: "100%",
                      }}
                    >
                      <option value="">Select...</option>
                      {[
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "O+",
                        "O-",
                        "Unknown",
                      ].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{profile.blood_type || "Not set"}</span>
                  )}
                </div>
                <div
                  className="info-item"
                  style={{
                    gridColumn: "1 / -1",
                    background: "#fcfcfc",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px dashed #ccc",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      Digital Signature for ID{" "}
                      <span style={{ color: "red" }}>*</span>
                    </span>
                    {profile.signature_image &&
                      editingSection !== "requirements" && (
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "green",
                            fontWeight: "bold",
                          }}
                        >
                          ✔️ Uploaded
                        </span>
                      )}
                  </label>
                  {editingSection === "requirements" ? (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => signatureRef.current.click()}
                        style={{
                          padding: "8px 16px",
                          background: "white",
                          border: "1px solid var(--orange-500)",
                          color: "var(--orange-600)",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Upload Image
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={signatureRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, "signature_image")}
                      />
                      {formData.signature_image && (
                        <div
                          style={{
                            border: "1px solid #eee",
                            padding: "5px",
                            background: "white",
                            borderRadius: "4px",
                          }}
                        >
                          <img
                            src={formData.signature_image}
                            alt="Signature Preview"
                            style={{ maxHeight: "40px", display: "block" }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ marginTop: "10px" }}>
                      {profile.signature_image ? (
                        <img
                          src={profile.signature_image}
                          alt="Signature"
                          style={{
                            maxHeight: "60px",
                            background: "white",
                            padding: "5px",
                            borderRadius: "4px",
                            border: "1px solid #eee",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: "#dc3545",
                            fontStyle: "italic",
                            fontSize: "0.9rem",
                          }}
                        >
                          Missing - Required for ID processing.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 6. HIGHLIGHTED DOCUMENT VAULT */}
            <div
              style={{
                ...cardStyle,
                background: "#f8f9fa",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid #cbd5e1",
                  paddingBottom: "15px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "1.5rem" }}>📁</span>
                  <h2
                    style={{
                      color: "#334155",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      margin: 0,
                    }}
                  >
                    Document Vault
                  </h2>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {editingSection !== "documents" ? (
                    <button
                      className="btn btn-secondary"
                      style={{ background: "white" }}
                      onClick={() => setEditingSection("documents")}
                      disabled={editingSection !== null}
                    >
                      ✏️ Manage
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{
                          background: "#334155",
                          color: "white",
                          border: "none",
                        }}
                        onClick={() => handleSave("documents")}
                        disabled={saving}
                      >
                        💾 Save Files
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginBottom: "20px",
                }}
              >
                Securely upload your admissions requirements here. Supported
                formats: Images & PDFs.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {[
                  { id: "birth_cert", label: "Birth Certificate (PSA)" },
                  { id: "form_138", label: "Form 138 (Report Card)" },
                  { id: "good_moral", label: "Cert. of Good Moral Character" },
                ].map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      background: "white",
                      padding: "15px 20px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: "0 0 5px 0",
                          color: "#334155",
                          fontSize: "1rem",
                        }}
                      >
                        {doc.label}
                      </h4>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          color: profile[doc.id] ? "#059669" : "#dc2626",
                          background: profile[doc.id] ? "#d1fae5" : "#fee2e2",
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        {profile[doc.id] ? "✔️ UPLOADED" : "❌ MISSING"}
                      </span>
                    </div>

                    {editingSection === "documents" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => docRefs[doc.id].current.click()}
                          style={{
                            padding: "6px 16px",
                            background: "#f1f5f9",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            color: "#475569",
                          }}
                        >
                          Select File
                        </button>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          ref={docRefs[doc.id]}
                          style={{ display: "none" }}
                          onChange={(e) => handleFileUpload(e, doc.id)}
                        />
                        {formData[doc.id] && (
                          <span style={{ fontSize: "1.2rem" }}>✅</span>
                        )}
                      </div>
                    ) : (
                      <div>
                        {profile[doc.id] ? (
                          <a
                            href={profile[doc.id]}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "var(--orange-600)",
                              textDecoration: "none",
                              fontSize: "0.9rem",
                              fontWeight: "bold",
                            }}
                          >
                            View File ↗
                          </a>
                        ) : (
                          <span
                            style={{ color: "#94a3b8", fontSize: "0.85rem" }}
                          >
                            No file attached
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
