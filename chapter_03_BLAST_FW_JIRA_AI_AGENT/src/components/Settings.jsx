import React, { useState } from 'react';

const FIELDS = [
  { key: 'jiraUrl', label: 'Jira Base URL', placeholder: 'https://your-domain.atlassian.net', type: 'text' },
  { key: 'jiraEmail', label: 'Jira Email', placeholder: 'you@example.com', type: 'text' },
  { key: 'jiraToken', label: 'Jira API Token', placeholder: 'ATATT...', type: 'password' },
  { key: 'groqKey', label: 'GROQ API Key', placeholder: 'gsk_...', type: 'password' },
];

export default function Settings({ config, onSave, envStatus }) {
  const [form, setForm] = useState(config);
  const [saved, setSaved] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  function submit(e) {
    e.preventDefault();
    onSave(form);
    setSaved(true);
  }

  return (
    <section className="card">
      <h2>Settings</h2>
      <p className="muted">
        Stored locally in your browser. Blank fields fall back to the server <code>.env</code>.
      </p>

      <form onSubmit={submit} className="form">
        {FIELDS.map((f) => (
          <label key={f.key} className="field">
            <span>{f.label}</span>
            <input
              type={f.type}
              value={form[f.key] || ''}
              placeholder={f.placeholder}
              onChange={(e) => update(f.key, e.target.value)}
              autoComplete="off"
              spellCheck="false"
            />
          </label>
        ))}

        <label className="field">
          <span>GROQ Model</span>
          <select
            value={form.groqModel || 'llama-3.3-70b-versatile'}
            onChange={(e) => update('groqModel', e.target.value)}
            className="select-input"
          >
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
            <option value="llama3-8b-8192">llama3-8b-8192</option>
            <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
            <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Legacy Default)</option>
          </select>
        </label>

        <div className="row">
          <button type="submit" className="primary">Save settings</button>
          {saved && <span className="ok">Saved ✓</span>}
        </div>
      </form>

      {envStatus && (
        <div className="envbox">
          <h3>Server <code>.env</code> status</h3>
          <ul>
            <li>Jira URL: {envStatus.jiraUrl ? <code>{envStatus.jiraUrl}</code> : <em>not set</em>}</li>
            <li>Jira Email: {envStatus.jiraEmail ? <code>{envStatus.jiraEmail}</code> : <em>not set</em>}</li>
            <li>Jira Token: {envStatus.hasJiraToken ? 'set ✓' : <em>not set</em>}</li>
            <li>GROQ Key: {envStatus.hasGroqKey ? 'set ✓' : <em>not set</em>}</li>
          </ul>
        </div>
      )}
    </section>
  );
}
