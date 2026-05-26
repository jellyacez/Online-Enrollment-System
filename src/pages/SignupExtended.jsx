import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/UniLogo.png";
import "../css/login-signup.css";

export default function SignupExtended() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back if accessed directly without basic info
  if (!location.state || !location.state.email) {
    navigate("/login");
    return null;
  }

  const { name, email, password, studentType } = location.state;

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [program, setProgram] = useState("");
  const [secondChoice, setSecondChoice] = useState("");
  const [lastSchool, setLastSchool] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExtendedSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email,
          password,
          student_type: studentType,
          address,
          phone,
          dob,
          program,
          second_choice_course: secondChoice,
          last_school: lastSchool,
          current_level: currentLevel
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success, go to login
      navigate("/login", { state: { message: "Extended registration successful! Please login." } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: "600px" }}>
        <button className="backButton" onClick={() => navigate("/login")}>
          &larr; Back
        </button>
        <img src={Logo} className="Uni-Logo" alt="University Logo" />
        <h2>{studentType === 'transferee' ? "Transferee Registration" : "New Enrollee Registration"}</h2>
        <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "20px" }}>
          Please complete your profile to finish setting up your account.
        </p>

        {error && (
          <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleExtendedSignUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          
          <div className="info-group" style={{ gridColumn: '1 / span 2' }}>
            <label htmlFor="address">Home Address</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Full Address" />
          </div>

          <div className="info-group">
            <label htmlFor="phone">Contact Number</label>
            <input 
              type="tel" 
              id="phone" 
              value={phone} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                setPhone(val);
              }} 
              required 
              placeholder="09XXXXXXXXX" 
            />
          </div>

          <div className="info-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>

          <datalist id="courseOptions">
            <option value="BS Information Technology" />
            <option value="BS Computer Science" />
            <option value="BS Information Systems" />
            <option value="BS Business Administration" />
            <option value="BS Accountancy" />
            <option value="BS Nursing" />
            <option value="BS Civil Engineering" />
            <option value="BS Mechanical Engineering" />
          </datalist>

          <div className="info-group">
            <label htmlFor="program">First Choice Course</label>
            <input 
              type="text" 
              id="program" 
              list="courseOptions"
              value={program} 
              onChange={(e) => setProgram(e.target.value)} 
              required 
              placeholder="Type or select a course" 
            />
          </div>

          <div className="info-group">
            <label htmlFor="secondChoice">Second Choice Course</label>
            <input 
              type="text" 
              id="secondChoice" 
              list="courseOptions"
              value={secondChoice} 
              onChange={(e) => setSecondChoice(e.target.value)} 
              placeholder="Type or select a course" 
            />
          </div>

          <div className="info-group" style={{ gridColumn: studentType === 'transferee' ? '1' : '1 / span 2' }}>
            <label htmlFor="lastSchool">Last School Attended</label>
            <input type="text" id="lastSchool" value={lastSchool} onChange={(e) => setLastSchool(e.target.value)} required placeholder="School Name" />
          </div>

          {studentType === 'transferee' && (
            <div className="info-group">
              <label htmlFor="currentLevel">Current Level (Transferee)</label>
              <input type="text" id="currentLevel" value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} required placeholder="e.g. 2nd Year" />
            </div>
          )}

          <div style={{ gridColumn: '1 / span 2', marginTop: "10px" }}>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
