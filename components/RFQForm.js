import { useState } from 'react';
import { createRFQ } from '../lib/api';

/**
 * RFQForm component encapsulates the request‑for‑quote form.  It collects
 * the project title, email, description and optional file attachments and
 * submits them to the API via `createRFQ`.
 */
export default function RFQForm() {
  const [form, setForm] = useState({ projectTitle: '', email: '', description: '' });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus('Submitting…');
      await createRFQ({ ...form, files });
      setStatus('RFQ submitted!');
      setForm({ projectTitle: '', email: '', description: '' });
      setFiles([]);
    } catch (err) {
      setStatus(`Submission failed: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Project Title*
        <input
          type="text"
          value={form.projectTitle}
          onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </label>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Email*
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </label>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Description*
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows="4"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </label>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Upload Files (optional, up to 5)
        <input
          type="file"
          multiple
          onChange={(e) => {
            const arr = Array.from(e.target.files).slice(0, 5);
            setFiles(arr);
          }}
        />
      </label>
      <button type="submit">Submit RFQ</button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </form>
  );
}