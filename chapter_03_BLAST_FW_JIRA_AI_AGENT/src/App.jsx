import React, { useEffect, useState } from 'react';
import Settings from './components/Settings.jsx';
import Generator from './components/Generator.jsx';
import { getConfigStatus } from './lib/api.js';

const STORAGE_KEY = 'blast.jira.config';
const THEME_KEY = 'blast.theme';
const emptyConfig = { jiraUrl: '', jiraEmail: '', jiraToken: '', groqKey: '', groqModel: 'llama-3.3-70b-versatile' };

export default function App() {
  const [tab, setTab] = useState('generate');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });
  const [config, setConfig] = useState(() => {
    try {
      return { ...emptyConfig, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch {
      return emptyConfig;
    }
  });
  const [envStatus, setEnvStatus] = useState(null);

  useEffect(() => {
    getConfigStatus().then(setEnvStatus).catch(() => setEnvStatus(null));
  }, []);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function saveConfig(next) {
    setConfig(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return (
    <div className={`app-container ${theme}-theme`}>
      <header className="topbar">
        <div className="brand">
          <span className="logo">🚀</span>
          <div>
            <h1>Jira → QA Strategy &amp; Plan Generator</h1>
            <p className="sub">B.L.A.S.T. · GROQ <code>{config.groqModel || 'llama-3.3-70b-versatile'}</code></p>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <nav className="tabs">
            <button className={tab === 'generate' ? 'active' : ''} onClick={() => setTab('generate')}>Generate</button>
            <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>Settings</button>
          </nav>
        </div>
      </header>

      <main className="content">
        {tab === 'generate' ? (
          <Generator config={config} envStatus={envStatus} goSettings={() => setTab('settings')} />
        ) : (
          <Settings config={config} onSave={saveConfig} envStatus={envStatus} />
        )}
      </main>

      <footer className="foot">Lightweight React · Express proxy · credentials stay local</footer>
    </div>
  );
}
