import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth.hook";
import "./auth-pages.scss";

const Register = () => {
  const { handelRegister, loading } = useAuth();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      await handelRegister({ userName, email, password });
      setOk("Account created.");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Could not register. Try again.";
      setError(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Register</h1>
        {ok ? <p className="auth-msg">{ok}</p> : null}
        {error ? <p className="auth-err">{error}</p> : null}
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-field">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              autoComplete="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Please wait…" : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
