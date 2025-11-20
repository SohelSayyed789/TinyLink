import { useState } from "react";
import { createLink } from "../api";
import "./AddlinksForm.css"; 

export default function AddLinkForm({ onSuccess }) {
  const [target_url, setTarget] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await createLink({ target_url, code });

    if (res.status === 409) {
      setError("This code is already in use.");
    } else if (!res.ok) {
      setError("Something went wrong.");
    } else {
      setSuccess("Link created!");
      setTarget("");
      setCode("");
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Create Short Link</h3>

      <div className="input-group">
        <input
          type="url"
          placeholder="Enter URL"
          value={target_url}
          onChange={(e) => setTarget(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  );
}
