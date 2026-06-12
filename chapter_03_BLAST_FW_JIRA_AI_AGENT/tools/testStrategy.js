// Layer 3 Tool — build the prompt, generate the strategy via GROQ, render deterministic Markdown.
import { groqChat } from './groqClient.js';

const SCHEMA_HINT = `Return ONLY a JSON object with EXACTLY these keys:
{
  "testStrategyId": string,              // e.g. "TS-<KEY>"
  "sourceIssue": string,                 // the Jira key
  "title": string,                       // "Test Strategy — <summary>"
  "objective": string,
  "scope": { "inScope": string[], "outOfScope": string[] },
  "testingTypes": [ { "type": string, "description": string } ],
  "automationApproach": { "framework": string, "coverageGoal": string, "ciIntegration": string },
  "environmentMatrix": [ { "env": string, "url": string, "purpose": string } ],
  "defectManagement": { "tool": string, "lifecycle": string, "severityScale": string },
  "risksAndMitigations": [ { "risk": string, "mitigation": string } ],
  "deliverables": string[]
}`;

export function buildStrategyMessages(issue, strategyDocument) {
  const system = [
    'You are a senior QA Architect writing a FORMAL software Test Strategy.',
    'Base everything strictly on the provided Jira issue.',
    'Follow any custom formatting or guidelines provided by the user in the strategy document.',
    'If information is missing from the ticket, use "TBD" — never invent specific facts (names, dates, versions).',
    'Be concrete, professional, and concise. Output strictly valid JSON.',
  ].join(' ');

  const customGuidelinesSection = strategyDocument
    ? `### Custom Strategy Format & Guidelines:\n${strategyDocument}\n\n`
    : '';

  const user = [
    'Create a formal Test Strategy for the following Jira issue.',
    '',
    `Key: ${issue.key}`,
    `Summary: ${issue.summary}`,
    `Type: ${issue.issueType} | Status: ${issue.status} | Priority: ${issue.priority}`,
    `Components: ${issue.components.join(', ') || 'none'}`,
    `Labels: ${issue.labels.join(', ') || 'none'}`,
    `Fix Versions: ${issue.fixVersions.join(', ') || 'none'}`,
    `Reporter: ${issue.reporter} | Assignee: ${issue.assignee || 'Unassigned'}`,
    '',
    'Description / Acceptance Criteria:',
    issue.description || '(none provided)',
    '',
    customGuidelinesSection,
    'JSON Output Format Target:',
    SCHEMA_HINT,
  ].join('\n');

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}

const arr = (v) => (Array.isArray(v) ? v : []);
const obj = (v) => (v && typeof v === 'object' ? v : {});

export async function generateTestStrategy(config, issue, strategyDocument) {
  // Use the configuration model if provided, otherwise fallback to the default GROQ model.
  const plan = await groqChat(config, buildStrategyMessages(issue, strategyDocument), { json: true, temperature: 0.3 });

  // Defensive normalization so the renderer never crashes on a missing key.
  const norm = {
    testStrategyId: plan.testStrategyId || `TS-${issue.key}`,
    sourceIssue: plan.sourceIssue || issue.key,
    title: plan.title || `Test Strategy — ${issue.summary}`,
    objective: plan.objective || 'TBD',
    scope: {
      inScope: arr(plan.scope?.inScope),
      outOfScope: arr(plan.scope?.outOfScope),
    },
    testingTypes: arr(plan.testingTypes),
    automationApproach: {
      framework: obj(plan.automationApproach).framework || 'TBD',
      coverageGoal: obj(plan.automationApproach).coverageGoal || 'TBD',
      ciIntegration: obj(plan.automationApproach).ciIntegration || 'TBD',
    },
    environmentMatrix: arr(plan.environmentMatrix),
    defectManagement: {
      tool: obj(plan.defectManagement).tool || 'TBD',
      lifecycle: obj(plan.defectManagement).lifecycle || 'TBD',
      severityScale: obj(plan.defectManagement).severityScale || 'TBD',
    },
    risksAndMitigations: arr(plan.risksAndMitigations),
    deliverables: arr(plan.deliverables),
  };

  return norm;
}

function bullets(list) {
  if (!list || !list.length) return ['- TBD'];
  return list.map((i) => `- ${i}`);
}

export function renderStrategyMarkdown(strategy, issue) {
  const L = [];
  L.push(`# ${strategy.title}`, '');
  L.push(`**Test Strategy ID:** ${strategy.testStrategyId}  `);
  L.push(`**Source Issue:** ${strategy.sourceIssue}  `);
  L.push(`**Issue Type:** ${issue.issueType} | **Priority:** ${issue.priority} | **Status:** ${issue.status}  `);
  L.push('');

  L.push('## 1. Objective', '', strategy.objective, '');

  L.push('## 2. Scope', '');
  L.push('**In Scope**', '', ...bullets(strategy.scope.inScope), '');
  L.push('**Out of Scope**', '', ...bullets(strategy.scope.outOfScope), '');

  L.push('## 3. Testing Methodology & Types', '');
  if (strategy.testingTypes.length) {
    strategy.testingTypes.forEach((t) => {
      L.push(`### ${t.type || 'Test Type'}`, t.description || 'TBD', '');
    });
  } else {
    L.push('TBD', '');
  }

  L.push('## 4. Test Automation Approach', '');
  L.push(`- **Framework:** ${strategy.automationApproach.framework}`);
  L.push(`- **Coverage Goal:** ${strategy.automationApproach.coverageGoal}`);
  L.push(`- **CI/CD Integration:** ${strategy.automationApproach.ciIntegration}`);
  L.push('');

  L.push('## 5. Test Environment Matrix', '');
  if (strategy.environmentMatrix.length) {
    L.push('| Environment | Target URL / Info | Purpose / Role |', '| --- | --- | --- |');
    strategy.environmentMatrix.forEach((env) => {
      L.push(`| ${env.env || 'TBD'} | ${env.url || 'TBD'} | ${env.purpose || 'TBD'} |`);
    });
  } else {
    L.push('TBD');
  }
  L.push('');

  L.push('## 6. Defect Management Flow', '');
  L.push(`- **Defect Tool:** ${strategy.defectManagement.tool}`);
  L.push(`- **Lifecycle Phases:** ${strategy.defectManagement.lifecycle}`);
  L.push(`- **Severity Scale:** ${strategy.defectManagement.severityScale}`);
  L.push('');

  L.push('## 7. Risks & Mitigations', '');
  if (strategy.risksAndMitigations.length) {
    L.push('| Risk Description | Mitigation Plan |', '| --- | --- |');
    strategy.risksAndMitigations.forEach((r) => {
      L.push(`| ${r.risk || 'TBD'} | ${r.mitigation || 'TBD'} |`);
    });
  } else {
    L.push('TBD');
  }
  L.push('');

  L.push('## 8. Test Deliverables', '', ...bullets(strategy.deliverables), '');

  L.push('', '---', `_Generated from ${strategy.sourceIssue} via GROQ. Review and approve before execution._`);
  return L.join('\n');
}
