export interface AgentStep {
  id: string;
  phase: 'INGEST' | 'REASON' | 'TOOL_CALL' | 'GUARDRAIL' | 'OUTPUT';
  label: string;
  detail: string;
  latencyMs: number;
}

export interface AgentScenario {
  id: string;
  code: string;
  title: string;
  department: string;
  summary: string;
  impactMetric: string;
  triggerPayload: string;
  steps: AgentStep[];
  resultSummary: string;
}

export interface CapabilityModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  specs: string[];
  deliverable: string;
}

export interface FdeStage {
  step: string;
  title: string;
  windowTime: string;
  description: string;
  artifact: string;
}

export const PROFILE_DATA = {
  name: 'Winder Segura',
  handle: 'WINDER//OS v5.0',
  role: 'Software Developer & Forward Deployed Engineer',
  experienceYears: 5,
  email: 'segurawinder@gmail.com',
  githubUrl: 'https://github.com/windersegura',
  githubHandle: 'github.com/windersegura',
  statusText: 'ONLINE // READY FOR DEPLOYMENT',
  location: 'Remote & On-Site Field Deployment',
  // Strictly concise presentation message within 5 lines maximum
  presentationLines: [
    "My name is Winder Segura, a software developer and forward deployed engineer",
    "with 5 years of experience architecting and deploying AI agents for business.",
    "I embed directly within operations to turn manual, high-friction workflows into",
    "autonomous, production-grade agent systems connected to your real tools and data—",
    "engineered with strict guardrails, observability, and measurable ROI from day one."
  ],
  quickStats: [
    { label: 'Field Experience', value: '5 Years', sub: 'Full-Stack & AI Systems' },
    { label: 'Core Specialty', value: 'AI Agents', sub: 'Autonomous Business Workflows' },
    { label: 'Deployment Mode', value: 'Forward', sub: 'Embedded From Spec to Prod' },
    { label: 'Architecture', value: 'Production', sub: 'Tool-Use, RAG & Guardrails' }
  ]
};

export const BOOT_LOG_LINES = [
  { time: '00.012', tag: 'KERNEL', text: 'Initializing WINDER//OS v5.04 Field Workstation...' },
  { time: '00.084', tag: 'CPU_0', text: 'Mounting Forward-Deployed Engineering Runtime (5Y_EXP_VERIFIED)...' },
  { time: '00.190', tag: 'AGENT', text: 'Loading multi-agent orchestration graph & deterministic tool schemas...' },
  { time: '00.310', tag: 'SAFE', text: 'Verifying enterprise guardrail policies & PII redaction filters [OK]' },
  { time: '00.440', tag: 'LINK', text: 'Binding external endpoints: github.com/windersegura | segurawinder@gmail.com' },
  { time: '00.580', tag: 'UI_SYS', text: 'Hydrating interactive desktop workspace & live agent simulator...' }
];

export const AGENT_SCENARIOS: AgentScenario[] = [
  {
    id: 'erp-triage',
    code: 'AGT-01',
    title: 'ERP & Supply Chain Exception Agent',
    department: 'Operations & Finance',
    summary: 'Autonomously reconciles purchase orders, invoices, and vendor shipment delays across ERP & email.',
    impactMetric: '84% faster exception resolution',
    triggerPayload: 'EVENT: Invoice #INV-9042 mismatch (+14.2% variance vs PO #4410)',
    steps: [
      {
        id: 's1',
        phase: 'INGEST',
        label: 'Parse PDF Invoice & ERP Webhook',
        detail: 'Extracted 18 line items from vendor PDF and queried SAP/NetSuite record #4410.',
        latencyMs: 210
      },
      {
        id: 's2',
        phase: 'REASON',
        label: 'Isolate Freight & SKU Discrepancy',
        detail: 'Detected expedited air-freight surcharge approved in Slack thread #ops-urgent on Nov 09.',
        latencyMs: 340
      },
      {
        id: 's3',
        phase: 'TOOL_CALL',
        label: 'Execute ERP Voucher Patch + Audit Link',
        detail: 'Called erp.updateVarianceCode("FREIGHT_APPROVED") with cryptographic citation link.',
        latencyMs: 185
      },
      {
        id: 's4',
        phase: 'GUARDRAIL',
        label: 'Threshold Policy Gate (< $15,000)',
        detail: 'Variance ($1,420) within auto-approval policy; compliance log committed.',
        latencyMs: 95
      },
      {
        id: 's5',
        phase: 'OUTPUT',
        label: 'Ledger Reconciled & Controller Notified',
        detail: 'Zero human data entry required. Full audit trail pushed to finance channel.',
        latencyMs: 110
      }
    ],
    resultSummary: 'Reconciled in 0.94s with 100% audit traceability (vs. 42 mins manual review).'
  },
  {
    id: 'support-escalation',
    code: 'AGT-02',
    title: 'B2B Technical Support & Triage Agent',
    department: 'Customer Operations',
    summary: 'Diagnoses live API/account issues, inspects telemetry logs, and executes safe remediation actions.',
    impactMetric: '68% Tier-2 tickets resolved autonomously',
    triggerPayload: 'TICKET #8821: Enterprise client webhook deliveries failing with 429 rate-limit',
    steps: [
      {
        id: 'c1',
        phase: 'INGEST',
        label: 'Classify Incident & Pull Tenant Telemetry',
        detail: 'Matched tenant org_id="acme_global" and queried last 60m webhook delivery logs.',
        latencyMs: 180
      },
      {
        id: 'c2',
        phase: 'REASON',
        label: 'Root-Cause Analysis on Burst Traffic',
        detail: 'Identified bulk batch sync triggered without exponential backoff on endpoint /v2/events.',
        latencyMs: 290
      },
      {
        id: 'c3',
        phase: 'TOOL_CALL',
        label: 'Provision Burst Buffer & Replay Failed Queue',
        detail: 'Executed queue.replayDeadLetters(tenant="acme_global", rate="50/sec").',
        latencyMs: 240
      },
      {
        id: 'c4',
        phase: 'GUARDRAIL',
        label: 'Verify SLA & Data Isolation Boundary',
        detail: 'Confirmed zero cross-tenant access and validated 200 OK on 142 replayed payloads.',
        latencyMs: 110
      },
      {
        id: 'c5',
        phase: 'OUTPUT',
        label: 'Dispatch Root-Cause Summary to Client',
        detail: 'Sent tailored remediation report + SDK backoff snippet to customer engineer.',
        latencyMs: 130
      }
    ],
    resultSummary: '142 failed events recovered + client updated in 0.95s without waking on-call.'
  },
  {
    id: 'sql-intel',
    code: 'AGT-03',
    title: 'Executive Revenue & Operations Copilot',
    department: 'Executive & RevOps',
    summary: 'Bridges CRM, production SQL databases, and internal docs to answer complex operational questions.',
    impactMetric: '10x faster cross-system reporting',
    triggerPayload: 'QUERY: "Which enterprise accounts have renewal in <60d with open P1 bugs?"',
    steps: [
      {
        id: 'q1',
        phase: 'INGEST',
        label: 'Decompose Multi-Source Business Query',
        detail: 'Planned join across Salesforce renewals, Postgres usage metrics, and Linear issues.',
        latencyMs: 160
      },
      {
        id: 'q2',
        phase: 'TOOL_CALL',
        label: 'Execute Read-Only Parameterized SQL & API Calls',
        detail: 'Fetched 4 matching accounts ($640k ARR total) with active high-priority engineering tickets.',
        latencyMs: 310
      },
      {
        id: 'q3',
        phase: 'REASON',
        label: 'Synthesize Risk Score & Action Plan',
        detail: 'Ranked accounts by ARR exposure and linked assigned engineering owners.',
        latencyMs: 260
      },
      {
        id: 'q4',
        phase: 'GUARDRAIL',
        label: 'Enforce Role-Based Row-Level Security',
        detail: 'Verified requester permissions and masked sensitive billing tokens.',
        latencyMs: 80
      },
      {
        id: 'q5',
        phase: 'OUTPUT',
        label: 'Publish Interactive Brief & Schedule Syncs',
        detail: 'Generated executive table and drafted 4 proactive account retention tasks.',
        latencyMs: 120
      }
    ],
    resultSummary: 'Cross-system executive risk brief delivered in 0.93s with zero SQL written by user.'
  }
];

export const CAPABILITY_MODULES: CapabilityModule[] = [
  {
    id: 'orchestration',
    code: 'SYS_01',
    title: 'Autonomous Multi-Agent Orchestration',
    subtitle: 'Stateful reasoning graphs & deterministic workflows',
    description:
      'I design and deploy agent architectures that go far beyond fragile prompt chains—combining structured state machines, parallel sub-agents, and self-correcting execution loops.',
    specs: [
      'Deterministic state graphs with fallback routing',
      'Structured JSON/TypeScript tool-calling contracts',
      'Long-running background task & webhook resumption',
      'Model-agnostic routing (frontier reasoning + low-latency models)'
    ],
    deliverable: 'Production Agent Runtime & Orchestration API'
  },
  {
    id: 'integrations',
    code: 'SYS_02',
    title: 'Deep Enterprise Tool & Data Integration',
    subtitle: 'Connecting AI directly to your existing stack',
    description:
      'Agents are only as useful as the actions they can take. With 5 years of full-stack software engineering experience, I wire agents safely into your databases, CRMs, ERPs, and internal APIs.',
    specs: [
      'Custom MCP servers & secure internal API connectors',
      'Hybrid RAG over SQL, vector stores, and live documents',
      'Idempotent write actions with automatic rollback support',
      'Legacy system bridges without costly platform rewrites'
    ],
    deliverable: 'Hardened Connector Layer & MCP Tool Suite'
  },
  {
    id: 'guardrails',
    code: 'SYS_03',
    title: 'Evaluation Harnesses, Guardrails & Control',
    subtitle: 'Zero-trust safety and measurable reliability',
    description:
      'Business-critical agents cannot hallucinate permissions or corrupt records. Every deployment ships with automated evaluation benchmarks, human-in-the-loop gates, and live telemetry.',
    specs: [
      'Golden-dataset CI/CD eval suites before every prompt/model update',
      'Policy gates & human approval workflows for high-stakes actions',
      'PII scrubbing, RBAC enforcement, and immutable audit logs',
      'Real-time cost, latency, and resolution rate dashboards'
    ],
    deliverable: 'Eval Suite + Live Observability Console'
  }
];

export const FDE_STAGES: FdeStage[] = [
  {
    step: '01',
    title: 'Embedded Discovery & Workflow Mapping',
    windowTime: 'Days 1–4',
    description:
      'I sit directly with your operators and engineers to audit bottlenecks, inspect real data payloads, and define high-ROI agent boundaries.',
    artifact: 'Technical Architecture & ROI Spec'
  },
  {
    step: '02',
    title: 'Rapid Working Sandbox Prototype',
    windowTime: 'Week 1–2',
    description:
      'No slide-deck theater. I build an end-to-end functional agent connected to sandboxed business data so your team can test real scenarios immediately.',
    artifact: 'Live Interactive Agent Sandbox'
  },
  {
    step: '03',
    title: 'Guardrails, Eval Harness & Security Hardening',
    windowTime: 'Week 2–3',
    description:
      'We stress-test edge cases, add deterministic validation rules, implement human-in-the-loop escalation, and verify compliance.',
    artifact: 'Automated Eval Pipeline & Audit Logs'
  },
  {
    step: '04',
    title: 'Production Deployment & Team Enablement',
    windowTime: 'Week 4+',
    description:
      'Full deployment into your cloud/VPC with monitoring dashboards, runbooks, and hands-on engineering handoff so your team owns the system.',
    artifact: 'Production System & Telemetry Handoff'
  }
];
