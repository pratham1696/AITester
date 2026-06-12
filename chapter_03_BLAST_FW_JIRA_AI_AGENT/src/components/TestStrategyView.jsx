import React, { useState } from 'react';

function List({ items }) {
  if (!items || !items.length) return <p className="tbd">TBD</p>;
  return (
    <ul>
      {items.map((i, n) => (
        <li key={n}>{i}</li>
      ))}
    </ul>
  );
}

function Table({ cols, rows, cells }) {
  if (!rows || !rows.length) return <p className="tbd">TBD</p>;
  return (
    <table>
      <thead>
        <tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, n) => (
          <tr key={n}>{cells(r).map((v, m) => <td key={m}>{v || 'TBD'}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TestStrategyView({ plan, issue, markdown }) {
  const [raw, setRaw] = useState(false);

  return (
    <div className="plan">
      <div className="plan-head">
        <div>
          <h3>{plan.title}</h3>
          <p className="meta">
            <span>{plan.testStrategyId}</span> · <span>{issue.issueType}</span> · <span>{issue.priority}</span> ·{' '}
            <span>{issue.status}</span>
          </p>
        </div>
        <button className="ghost" onClick={() => setRaw((r) => !r)}>
          {raw ? 'Formatted' : 'Markdown'}
        </button>
      </div>

      {raw ? (
        <pre className="md">{markdown}</pre>
      ) : (
        <div className="sections">
          <section>
            <h4>1. Objective</h4>
            <p>{plan.objective}</p>
          </section>

          <section>
            <h4>2. Scope</h4>
            <h5>In Scope</h5>
            <List items={plan.scope.inScope} />
            <h5>Out of Scope</h5>
            <List items={plan.scope.outOfScope} />
          </section>

          <section>
            <h4>3. Testing Methodology &amp; Types</h4>
            {plan.testingTypes && plan.testingTypes.length ? (
              <div className="strategy-grid">
                {plan.testingTypes.map((t, index) => (
                  <div className="strategy-type-card" key={index}>
                    <div className="strategy-type-title">{t.type}</div>
                    <div className="strategy-type-desc">{t.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="tbd">TBD</p>
            )}
          </section>

          <section>
            <h4>4. Test Automation Approach</h4>
            <div className="automation-details">
              <p><strong>Framework:</strong> {plan.automationApproach.framework}</p>
              <p><strong>Coverage Goal:</strong> {plan.automationApproach.coverageGoal}</p>
              <p><strong>CI/CD Integration:</strong> {plan.automationApproach.ciIntegration}</p>
            </div>
          </section>

          <section>
            <h4>5. Test Environment Matrix</h4>
            <Table
              cols={['Environment', 'Target URL / Details', 'Purpose / Role']}
              rows={plan.environmentMatrix}
              cells={(env) => [env.env, env.url, env.purpose]}
            />
          </section>

          <section>
            <h4>6. Defect Management Flow</h4>
            <div className="defect-details">
              <p><strong>Defect Tool:</strong> {plan.defectManagement.tool}</p>
              <p><strong>Lifecycle:</strong> {plan.defectManagement.lifecycle}</p>
              <p><strong>Severity Scale:</strong> {plan.defectManagement.severityScale}</p>
            </div>
          </section>

          <section>
            <h4>7. Risks &amp; Mitigations</h4>
            <Table
              cols={['Risk Description', 'Mitigation Plan']}
              rows={plan.risksAndMitigations}
              cells={(r) => [r.risk || r.riskDescription, r.mitigation || r.mitigationPlan]}
            />
          </section>

          <section>
            <h4>8. Test Deliverables</h4>
            <List items={plan.deliverables} />
          </section>
        </div>
      )}
    </div>
  );
}
