import React, { useState } from 'react';
import { generatePlan, savePlan } from '../lib/api.js';
import TestPlanView from './TestPlanView.jsx';
import TestStrategyView from './TestStrategyView.jsx';

const DEFAULT_STRATEGY_GUIDELINES = `# Test Strategy Formatting & Guidelines
1. Adopt the role of an expert QA Lead/Architect with 15+ years experience.
2. Outline specific testing types relevant to this feature (Functional, Security, Regression, Performance, Compatibility).
3. Outline a detailed automation approach (using Playwright + TS, targeting 80% coverage, integrated with GitHub Actions).
4. Specify target environments in a matrix (Staging, UAT).
5. Specify defect lifecycle (New, In Progress, Resolved, Retest, Closed) and Severity Scale (Blocker, Critical, Major, Minor).
6. Detail a Risk Matrix outlining key implementation risks and mitigation steps.`;

export default function Generator({ config, envStatus, goSettings }) {
  const [jiraId, setJiraId] = useState('VWO-48');
  const [mode, setMode] = useState('strategy'); // 'plan' | 'strategy'
  const [issueSource, setIssueSource] = useState('input'); // 'input' | 'login' | 'dashboard'
  const [strategyDocument, setStrategyDocument] = useState(DEFAULT_STRATEGY_GUIDELINES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [savedPath, setSavedPath] = useState('');

  // Config check is relaxed since we support mock/dummy issues without config keys.
  const hasJira =
    (config.jiraUrl || envStatus?.jiraUrl) &&
    (config.jiraEmail || envStatus?.jiraEmail) &&
    (config.jiraToken || envStatus?.hasJiraToken);
  const hasGroq = config.groqKey || envStatus?.hasGroqKey;
  
  // We are ready to generate if we have Groq Key. If we don't have Jira credentials, we'll fall back to dummy/mock issues.
  const ready = Boolean(hasGroq);

  function handleSourceChange(e) {
    const val = e.target.value;
    setIssueSource(val);
    if (val === 'login') {
      setJiraId('LOGIN-101');
    } else if (val === 'dashboard') {
      setJiraId('DASH-202');
    } else {
      setJiraId('VWO-48');
    }
  }

  async function onGenerate(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setSavedPath('');
    setLoading(true);
    try {
      const activeJiraId = jiraId.trim() || 'VWO-48';
      const data = await generatePlan(
        activeJiraId,
        config,
        mode,
        mode === 'strategy' ? strategyDocument : ''
      );
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    const blob = new Blob([result.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'strategy' ? 'test-strategy' : 'test-plan'}-${jiraId.trim()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function saveServer() {
    setError('');
    try {
      const r = await savePlan(jiraId.trim(), result.markdown);
      setSavedPath(r.path);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <h2>Generate Quality Deliverables</h2>

      {!ready && (
        <div className="warn">
          Missing GROQ API Key. Please <button className="link" onClick={goSettings}>Open Settings</button> and add your key or configure the server <code>.env</code>.
        </div>
      )}

      {ready && !hasJira && (
        <div className="info-banner">
          💡 No Jira Credentials provided. Fetches will automatically resolve to offline Dummy Features.
        </div>
      )}

      <form onSubmit={onGenerate} className="generator-form">
        <div className="controls-row">
          <div className="control-group">
            <span className="control-label">Artifact Mode</span>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${mode === 'strategy' ? 'active' : ''}`}
                onClick={() => setMode('strategy')}
              >
                Test Strategy
              </button>
              <button
                type="button"
                className={`toggle-btn ${mode === 'plan' ? 'active' : ''}`}
                onClick={() => setMode('plan')}
              >
                Test Plan
              </button>
            </div>
          </div>

          <div className="control-group">
            <span className="control-label">Jira Feature Source</span>
            <select
              value={issueSource}
              onChange={handleSourceChange}
              className="select-input"
            >
              <option value="input">Fetch Jira ID / Custom Key</option>
              <option value="login">Dummy Login Feature (LOGIN-101)</option>
              <option value="dashboard">Dummy Dashboard Feature (DASH-202)</option>
            </select>
          </div>

          <div className="control-group flex-grow">
            <span className="control-label">Jira ID / Key</span>
            <input
              className="jira-input"
              value={jiraId}
              onChange={(e) => setJiraId(e.target.value)}
              placeholder="e.g. VWO-48"
              spellCheck="false"
              disabled={issueSource !== 'input'}
            />
          </div>
        </div>

        {mode === 'strategy' && (
          <div className="strategy-doc-group">
            <span className="control-label">Test Strategy Document Guidelines / Format</span>
            <p className="muted-small">
              Provide or customize the guidelines the AI will follow to format your Test Strategy.
            </p>
            <textarea
              className="strategy-textarea"
              value={strategyDocument}
              onChange={(e) => setStrategyDocument(e.target.value)}
              rows={6}
              placeholder="Paste custom test strategy document or guidelines here..."
            />
          </div>
        )}

        <div className="submit-row">
          <button type="submit" className="primary full-width" disabled={loading || !jiraId.trim() || !ready}>
            {loading ? 'Generating Quality Deliverable…' : `Generate ${mode === 'strategy' ? 'Test Strategy' : 'Test Plan'}`}
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Parsing ticket data and generating custom QA strategy...</span>
        </div>
      )}

      {error && <div className="error">⚠ {error}</div>}

      {result && (
        <>
          <div className="actions">
            <button onClick={download} className="ghost">⬇ Download .md</button>
            <button onClick={saveServer} className="ghost">💾 Save to server</button>
            {savedPath && (
              <span className="ok">
                Saved → <code>{savedPath}</code>
              </span>
            )}
          </div>
          {mode === 'strategy' ? (
            <TestStrategyView plan={result.plan} issue={result.issue} markdown={result.markdown} />
          ) : (
            <TestPlanView plan={result.plan} issue={result.issue} markdown={result.markdown} />
          )}
        </>
      )}
    </section>
  );
}
