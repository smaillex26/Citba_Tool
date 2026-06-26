import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import { login } from "../services/api.js";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@citba.local");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const result = await login(email, password);
    if (result?.success === false) {
      setMessage(result.message);
      return;
    }
    onLogin(result.user);
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <p className="site-header__eyebrow">Outil interne CITBA</p>
        <h1>Connexion</h1>
        <p>Connectez-vous pour importer, modifier les facteurs et administrer les sauvegardes.</p>
        {message && <p className="import-status-msg import-status-msg--error">{message}</p>}
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>
        <label>
          Mot de passe
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </label>
        <Button type="submit">Se connecter</Button>
      </form>
    </main>
  );
}

export default LoginPage;
