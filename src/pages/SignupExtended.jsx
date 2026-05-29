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
          current_level: studentType === "new" ? "1st Year" : currentLevel,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error(
          response.ok
            ? "Invalid server response."
            : `Server is unreachable (Status: ${response.status}). Is the backend running?`,
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success, go to login
      navigate("/login", {
        state: { message: "Extended registration successful! Please login." },
      });
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
        <h2>
          {studentType === "transferee"
            ? "Transferee Registration"
            : "New Enrollee Registration"}
        </h2>
        <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "20px" }}>
          Please complete your profile to finish setting up your account.
        </p>

        {error && (
          <div
            style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleExtendedSignUp}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <div className="info-group" style={{ gridColumn: "1 / span 2" }}>
            <label htmlFor="address">Home Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Full Address"
            />
          </div>

          <div className="info-group">
            <label htmlFor="phone">Contact Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                setPhone(val);
              }}
              required
              placeholder="09XXXXXXXXX"
              pattern="09[0-9]{9}"
              title="Enter a valid 11-digit mobile number"
              minLength={11}
              maxLength={11}
            />
          </div>

          <div className="info-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
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
            {/* <input
              type="text"
              id="program"
              list="courseOptions"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              required
              placeholder="Type or select a course"
            /> */}
            <select
              id="program"
              required
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              <option value="">Select a course</option>

              <option value="BS Information Technology">
                BS Information Technology
              </option>

              <option value="BS Computer Science">BS Computer Science</option>

              <option value="BS Information Systems">
                BS Information Systems
              </option>

              <option value="BS Business Administration">
                BS Business Administration
              </option>

              <option value="BS Accountancy">BS Accountancy</option>

              <option value="BS Nursing">BS Nursing</option>

              <option value="BS Civil Engineering">BS Civil Engineering</option>

              <option value="BS Mechanical Engineering">
                BS Mechanical Engineering
              </option>
            </select>
          </div>

          <div className="info-group">
            <label htmlFor="secondChoice">Second Choice Course</label>

            <select
              id="secondChoice"
              required
              value={secondChoice}
              onChange={(e) => setSecondChoice(e.target.value)}
            >
              <option value="">Select a course</option>

              <option value="BS Information Technology" disabled={program === "BS Information Technology"}>
                BS Information Technology
              </option>

              <option value="BS Computer Science" disabled={program === "BS Computer Science"}>BS Computer Science</option>

              <option value="BS Information Systems" disabled={program === "BS Information Systems"}>
                BS Information Systems
              </option>

              <option value="BS Business Administration" disabled={program === "BS Business Administration"}>
                BS Business Administration
              </option>

              <option value="BS Accountancy" disabled={program === "BS Accountancy"}>BS Accountancy</option>

              <option value="BS Nursing" disabled={program === "BS Nursing"}>BS Nursing</option>

              <option value="BS Civil Engineering" disabled={program === "BS Civil Engineering"}>BS Civil Engineering</option>

              <option value="BS Mechanical Engineering" disabled={program === "BS Mechanical Engineering"}>
                BS Mechanical Engineering
              </option>
            </select>
            {/* <input
              type="text"
              id="secondChoice"
              list="courseOptions"
              value={secondChoice}
              onChange={(e) => setSecondChoice(e.target.value)}
              placeholder="Type or select a course"
            /> */}
          </div>

          <div
            className="info-group"
            style={{
              gridColumn: studentType === "transferee" ? "1" : "1 / span 2",
            }}
          >
            <label htmlFor="lastSchool">Last School Attended</label>
            <input
              type="text"
              id="lastSchool"
              value={lastSchool}
              onChange={(e) => setLastSchool(e.target.value)}
              required
              placeholder="School Name"
            />
          </div>

          {studentType === "transferee" && (
            <div className="info-group">
              <label htmlFor="currentLevel">Current Level (Transferee)</label>
              <select
                id="currentLevel"
                required
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
              >
                <option value="">Enter Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          )}

          <div style={{ gridColumn: "1 / span 2", marginTop: "10px" }}>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
