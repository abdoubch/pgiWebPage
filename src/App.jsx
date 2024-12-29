import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [formData, setFormData] = useState({
      name: "", // Nom de l'opportunité
      contact_name: "", // Nom du contact
      email_from: "", // Email du contact
      phone: "", // Téléphone
      description: "", // Description
    });

    const [status, setStatus] = useState("");
    const [sessionId, setSessionId] = useState(null);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const authenticate = async () => {
      try {
        const response = await fetch("/api/web/session/authenticate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
              db: "projetpgi",
              login: "abdegh0343@gmail.com",
              password: "projetpgi",
            },
          }),
        });
        const data = await response.json();
        if (data.result && data.result.uid) {
          setSessionId(data.result.session_id);
        } else {
          setStatus("Erreur d'authentification");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setStatus("Erreur d'authentification");
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (!sessionId) {
          await authenticate();
        }
        const response = await fetch("/api/web/dataset/call_kw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionId}`,
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            params: {
              model: "crm.lead",
              method: "create",
              args: [formData],
              kwargs: {},
            },
          }),
        });
        const data = await response.json();
        if (data.result) {
          setStatus("Opportunité créée avec succès ! ID : " + data.result);
        } else {
          setStatus("Erreur lors de la création.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        setStatus("Erreur lors de la soumission.");
      }
    };

  return (
    <>
      <>
        <div>
          <h1>Créer une opportunité CRM</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nom de l'opportunité"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contact_name"
              placeholder="Nom du contact"
              value={formData.contact_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email_from"
              placeholder="Email du contact"
              value={formData.email_from}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <button type="submit">Créer l'opportunité</button>
          </form>
          {status && <p>{status}</p>}
        </div>
      </>
    </>
  );
}

export default App
