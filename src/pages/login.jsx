import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/UniLogo.png";
import "../css/login-signup.css";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [conpassword, setConpassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== conpassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Automatically switch to login mode after successful registration
      setIsLogin(true);
      setError("Registration successful! Please login.");
      setPassword("");
      setConpassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google Auth Triggered");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="backButton" onClick={() => navigate("/")}>
          &larr; Back to Home
        </button>
        <img src={Logo} className="Uni-Logo" alt="University Logo" />
        <h2>{isLogin ? "Welcome Back" : "Create an Account"}</h2>

        {error && (
          <div style={{ color: error.includes("successful") ? "green" : "red", marginBottom: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="info-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="info-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="toggle-wrapper">
              <span className="toggle-text" onClick={() => setIsLogin(false)}>
                No account? <strong>Sign up here.</strong>
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <div className="info-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="info-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="info-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="info-group">
              <label htmlFor="conpassword">Confirm Password</label>
              <input
                type="password"
                id="conpassword"
                name="conpassword"
                placeholder="Confirm password"
                value={conpassword}
                onChange={(e) => setConpassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <div className="toggle-wrapper">
              <span className="toggle-text" onClick={() => setIsLogin(true)}>
                Already have an account? <strong>Login here.</strong>
              </span>
            </div>
          </form>
        )}

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login-container">
          <button
            type="button"
            className="social-btn google-btn"
            onClick={handleGoogleLogin}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}