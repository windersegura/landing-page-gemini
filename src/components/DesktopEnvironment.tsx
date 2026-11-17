import React, { useState, useEffect, useRef } from 'react';
import {
  PROFILE_DATA,
  AGENT_SCENARIOS,
  CAPABILITY_MODULES,
  FDE_STAGES,
  type AgentScenario
} from '../data/workstationData';
import { BootScreen } from './BootScreen';
import {
  FileText,
  Terminal,
  Layers,
  GitBranch,
  Mail,
  Github,
  Play,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Maximize2,
  Minimize2,
  Minus,
  X,
  Cpu,
  LayoutGrid,
  Monitor,
  Sparkles,
  Shield,
  Send,
  Activity,
  ChevronRight,
  Power
} from 'lucide-react';

export type WindowId = 'bio' | 'simulator' | 'capabilities' | 'protocol' | 'contact';

interface WindowConfig {
  id: WindowId;
  filename: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  width: number;
}

const INITIAL_WINDOWS: Record<WindowId, WindowConfig> = {
  bio: {
    id: 'bio',
    filename: 'readme_winder.md',
    shortTitle: 'README.md',
    subtitle: 'Executive Profile // Forward Deployed Engineer',
    icon: FileText,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 30,
    position: { x: 148, y: 26 },
    width: 650
  },
  simulator: {
    id: 'simulator',
    filename: 'agent_runtime.sh',
    shortTitle: 'Agent_Sim.exe',
    subtitle: 'Live Autonomous Business Agent Telemetry',
    icon: Terminal,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 29,
    position: { x: 540, y: 155 },
    width: 630
  },
  capabilities: {
    id: 'capabilities',
    filename: 'deployments.db',
    shortTitle: 'Systems.db',
    subtitle: 'Enterprise AI Architecture & Tooling',
    icon: Layers,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 25,
    position: { x: 210, y: 64 },
    width: 660
  },
  protocol: {
    id: 'protocol',
    filename: 'fde_protocol.sys',
    shortTitle: 'FDE_Playbook',
    subtitle: 'Forward Deployment Methodology (4-Week Rollout)',
    icon: GitBranch,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 24,
    position: { x: 260, y: 92 },
    width: 640
  },
  contact: {
    id: 'contact',
    filename: 'comms_link.app',
    shortTitle: 'Comms_Link',
    subtitle: 'Direct Dispatch // segurawinder@gmail.com',
    icon: Mail,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 28,
    position: { x: 310, y: 78 },
    width: 580
  }
};

export const DesktopEnvironment: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [windows, setWindows] = useState<Record<WindowId, WindowConfig>>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<WindowId>('bio');
  const [selectedIcon, setSelectedIcon] = useState<string>('bio');
  const [workspaceMode, setWorkspaceMode] = useState<'floating' | 'tiled'>('floating');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [clockText, setClockText] = useState('14:32:08');

  // Agent Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(AGENT_SCENARIOS[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(AGENT_SCENARIOS[0].steps.length);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);

  // Capabilities Module State
  const [activeCapId, setActiveCapId] = useState<string>(CAPABILITY_MODULES[0].id);

  // Contact / Dispatch State
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedScope, setSelectedScope] = useState('Custom Operations AI Agent');
  const [clientNote, setClientNote] = useState('');

  // Start Menu Popover Ref
  const startMenuRef = useRef<HTMLDivElement | null>(null);
  const dispatchFormRef = useRef<HTMLFormElement | null>(null);

  // Polyfill feature detection & native Popover toggle sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
      import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js' as any).catch(
        () => {}
      );
    }
    if (!('commandForElement' in HTMLButtonElement.prototype)) {
      import('https://esm.run/invokers-polyfill' as any).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const popoverEl = startMenuRef.current;
    if (!popoverEl) return;
    const handleToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      if (toggleEvent.newState) {
        setStartMenuOpen(toggleEvent.newState === 'open');
      }
    };
    popoverEl.addEventListener('toggle', handleToggle);
    return () => popoverEl.removeEventListener('toggle', handleToggle);
  }, []);

  const hideStartMenu = () => {
    setStartMenuOpen(false);
    const popoverEl = startMenuRef.current as any;
    if (popoverEl && typeof popoverEl.hidePopover === 'function') {
      try {
        popoverEl.hidePopover();
      } catch {
        // Ignore if already hidden
      }
    }
  };

  // Spatial Navigation (2D Arrow-Key Roving Tabindex)
  const handleSpatialKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const dirMap: Record<string, 'left' | 'right' | 'up' | 'down'> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down'
    };
    const dir = dirMap[e.key];
    if (!dir) return;

    const rawTarget = (e.nativeEvent.composedPath?.()[0] || e.target) as HTMLElement;
    if (
      !rawTarget ||
      rawTarget.matches?.(':read-write, select, input[type="range"], [role="slider"]')
    ) {
      return;
    }

    const container = e.currentTarget;
    const candidates = Array.from(
      container.querySelectorAll<HTMLElement>('[data-spatial-item]')
    ).filter((el) => (typeof el.checkVisibility === 'function' ? el.checkVisibility() : true));

    if (!candidates.includes(rawTarget)) return;

    const currentRect = rawTarget.getBoundingClientRect();
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;
    const tolerance = 2;

    const inDirection = candidates.filter((cand) => {
      if (cand === rawTarget) return false;
      const r = cand.getBoundingClientRect();
      switch (dir) {
        case 'right':
          return r.left >= currentRect.right - tolerance;
        case 'left':
          return r.right <= currentRect.left + tolerance;
        case 'down':
          return r.top >= currentRect.bottom - tolerance;
        case 'up':
          return r.bottom <= currentRect.top + tolerance;
      }
    });

    if (inDirection.length === 0) return; // Do not preventDefault so native scrolling works

    const isHorizontal = dir === 'left' || dir === 'right';
    const aligned: Array<{ el: HTMLElement; gap: number; perpOffset: number }> = [];
    const unaligned: Array<{ el: HTMLElement; score: number }> = [];

    for (const cand of inDirection) {
      const r = cand.getBoundingClientRect();
      const candCenterX = r.left + r.width / 2;
      const candCenterY = r.top + r.height / 2;

      const gap =
        dir === 'right'
          ? Math.max(0, r.left - currentRect.right)
          : dir === 'left'
          ? Math.max(0, currentRect.left - r.right)
          : dir === 'down'
          ? Math.max(0, r.top - currentRect.bottom)
          : Math.max(0, currentRect.top - r.bottom);

      const perpOverlap = isHorizontal
        ? Math.min(currentRect.bottom, r.bottom) > Math.max(currentRect.top, r.top)
        : Math.min(currentRect.right, r.right) > Math.max(currentRect.left, r.left);

      const perpOffset = isHorizontal
        ? Math.abs(candCenterY - currentCenterY)
        : Math.abs(candCenterX - currentCenterX);

      if (perpOverlap) {
        aligned.push({ el: cand, gap, perpOffset });
      } else {
        unaligned.push({ el: cand, score: gap + 2.5 * perpOffset });
      }
    }

    let bestCandidate: HTMLElement | null = null;
    if (aligned.length > 0) {
      aligned.sort((a, b) => a.gap - b.gap || a.perpOffset - b.perpOffset);
      bestCandidate = aligned[0].el;
    } else if (unaligned.length > 0) {
      unaligned.sort((a, b) => a.score - b.score);
      bestCandidate = unaligned[0].el;
    }

    if (!bestCandidate) return;

    e.preventDefault();
    bestCandidate.focus();
    bestCandidate.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  // Window Dragging Refs
  const dragRef = useRef<{
    id: WindowId;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Live Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockText(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Agent Simulator Execution Effect
  const currentScenario: AgentScenario =
    AGENT_SCENARIOS.find((s) => s.id === selectedScenarioId) || AGENT_SCENARIOS[0];

  useEffect(() => {
    if (!isSimRunning) return;
    if (activeStepIndex >= currentScenario.steps.length) {
      setIsSimRunning(false);
      return;
    }
    const stepTimer = window.setTimeout(() => {
      setActiveStepIndex((prev) => prev + 1);
    }, 420);
    return () => window.clearTimeout(stepTimer);
  }, [isSimRunning, activeStepIndex, currentScenario]);

  const runScenarioSimulation = (scenarioId?: string) => {
    const targetId = scenarioId || selectedScenarioId;
    if (scenarioId && scenarioId !== selectedScenarioId) {
      setSelectedScenarioId(scenarioId);
    }
    setActiveStepIndex(0);
    setIsSimRunning(true);
  };

  // Window Management Actions
  const focusWindow = (id: WindowId) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const maxZ = Math.max(...Object.values(prev).map((w) => w.zIndex), 30);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          isOpen: true,
          isMinimized: false,
          zIndex: maxZ + 1
        }
      };
    });
  };

  const openWindow = (id: WindowId) => {
    setSelectedIcon(id);
    hideStartMenu();
    focusWindow(id);
  };

  const closeWindow = (id: WindowId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        isMinimized: false,
        isMaximized: false
      }
    }));
  };

  const toggleMinimizeWindow = (id: WindowId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows((prev) => {
      const target = prev[id];
      const nextMin = !target.isMinimized;
      return {
        ...prev,
        [id]: {
          ...target,
          isMinimized: nextMin
        }
      };
    });
  };

  const toggleMaximizeWindow = (id: WindowId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    focusWindow(id);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized
      }
    }));
  };

  const openAllShowcaseWindows = () => {
    setWorkspaceMode('tiled');
    hideStartMenu();
    setWindows((prev) => {
      const next = { ...prev };
      (Object.keys(next) as WindowId[]).forEach((k, idx) => {
        next[k] = {
          ...next[k],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: 30 + idx
        };
      });
      return next;
    });
  };

  const resetDesktopCascade = () => {
    setWorkspaceMode('floating');
    hideStartMenu();
    setWindows(INITIAL_WINDOWS);
    setActiveWindowId('bio');
  };

  // Pointer Dragging for Floating Windows
  const handleTitlePointerDown = (
    id: WindowId,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (workspaceMode === 'tiled') return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    const win = windows[id];
    if (win.isMaximized) return;

    focusWindow(id);
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.position.x,
      origY: win.position.y
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { id, startX, startY, origX, origY } = dragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const clampedX = Math.max(16, Math.min(window.innerWidth - 320, origX + dx));
      const clampedY = Math.max(12, Math.min(window.innerHeight - 140, origY + dy));

      setWindows((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          position: { x: clampedX, y: clampedY }
        }
      }));
    };

    const handlePointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(PROFILE_DATA.email);
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2400);
  };

  const buildMailtoHref = () => {
    const subject = encodeURIComponent(
      `[AI Agent Deployment Inquiry] ${selectedScope} — via WINDER//OS`
    );
    const body = encodeURIComponent(
      `Hi Winder,\n\nWe are looking to design and deploy an AI agent system for: ${selectedScope}.\n\nWorkflow / Context:\n${
        clientNote || 'Looking to schedule an architectural discovery call.'
      }\n\nBest regards,`
    );
    return `mailto:${PROFILE_DATA.email}?subject=${subject}&body=${body}`;
  };

  const renderWindowContent = (id: WindowId) => {
    switch (id) {
      case 'bio':
        return (
          <div className="win-bio-body">
            {/* Top Identity Strip */}
            <div className="bio-status-strip">
              <div className="bio-status-badge">
                <span className="status-pulse-dot" />
                <span>{PROFILE_DATA.statusText}</span>
              </div>
              <span className="bio-exp-pill">5 YEARS EXPERIENCE // FDE</span>
            </div>

            {/* Hero Name & Role */}
            <div className="bio-header-block">
              <div className="bio-avatar-monogram" aria-hidden="true">
                <span>WS</span>
                <span className="monogram-sub">AI//FDE</span>
              </div>
              <div className="bio-title-group">
                <h1 className="bio-name">{PROFILE_DATA.name}</h1>
                <p className="bio-role">{PROFILE_DATA.role}</p>
              </div>
            </div>

            {/* Presentation Message: Strictly <= 5 Lines, High-Contrast Spec */}
            <div className="bio-presentation-box" aria-label="Presentation Message">
              <div className="bio-presentation-header">
                <span>PRESENTATION_BRIEF.TXT</span>
                <span>5 LINES // VERIFIED</span>
              </div>
              <p className="bio-presentation-text">
                {PROFILE_DATA.presentationLines.join(' ')}
              </p>
            </div>

            {/* 4 Key Telemetry Stats */}
            <div className="bio-stats-grid">
              {PROFILE_DATA.quickStats.map((stat) => (
                <div key={stat.label} className="bio-stat-card">
                  <span className="bio-stat-label">{stat.label}</span>
                  <strong className="bio-stat-value">{stat.value}</strong>
                  <span className="bio-stat-sub">{stat.sub}</span>
                </div>
              ))}
            </div>

            {/* Primary CTA Bar */}
            <div className="bio-actions-row">
              <button
                type="button"
                className="hw-btn hw-btn--primary"
                onClick={() => openWindow('contact')}
              >
                <Mail size={16} />
                <span>Deploy an Agent With Me</span>
              </button>

              <button
                type="button"
                className="hw-btn hw-btn--secondary"
                onClick={() => {
                  openWindow('simulator');
                  runScenarioSimulation();
                }}
              >
                <Play size={15} />
                <span>Run Live Agent Simulator</span>
              </button>

              <a
                href={PROFILE_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hw-btn hw-btn--ghost"
              >
                <Github size={16} />
                <span>{PROFILE_DATA.githubHandle}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        );

      case 'simulator':
        return (
          <div className="win-sim-body">
            {/* Scenario Selector Tabs */}
            <div className="sim-top-controls">
              <div
                className="sim-scenario-tabs"
                role="tablist"
                aria-label="Agent Simulation Scenarios"
                onKeyDown={handleSpatialKeyDown}
              >
                {AGENT_SCENARIOS.map((sc) => {
                  const isSelected = sc.id === selectedScenarioId;
                  return (
                    <button
                      key={sc.id}
                      id={`sim-tab-${sc.id}`}
                      type="button"
                      role="tab"
                      data-spatial-item=""
                      tabIndex={isSelected ? 0 : -1}
                      aria-selected={isSelected}
                      aria-controls="sim-tabpanel-console"
                      className={`sim-tab-btn ${isSelected ? 'sim-tab-btn--active' : ''}`}
                      onClick={() => runScenarioSimulation(sc.id)}
                    >
                      <span className="sim-tab-code">{sc.code}</span>
                      <span className="sim-tab-name">{sc.department}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="sim-rerun-btn"
                onClick={() => runScenarioSimulation()}
                title="Re-run agent execution trace"
              >
                <RotateCcw size={14} className={isSimRunning ? 'spin-icon' : ''} />
                <span>{isSimRunning ? 'Executing...' : 'Replay Trace'}</span>
              </button>
            </div>

            {/* Scenario Header Info */}
            <div className="sim-scenario-banner">
              <div>
                <h2 className="sim-scenario-title">{currentScenario.title}</h2>
                <p className="sim-scenario-desc">{currentScenario.summary}</p>
              </div>
              <div className="sim-impact-badge">
                <Sparkles size={14} />
                <span>{currentScenario.impactMetric}</span>
              </div>
            </div>

            {/* Dark Telemetry Console */}
            <div
              id="sim-tabpanel-console"
              role="tabpanel"
              aria-labelledby={`sim-tab-${selectedScenarioId}`}
              className="sim-terminal-viewport"
            >
              <div className="sim-trigger-line">
                <span className="sim-prompt">$</span>
                <span className="sim-trigger-payload">{currentScenario.triggerPayload}</span>
              </div>

              <div className="sim-steps-list">
                {currentScenario.steps.map((step, index) => {
                  const isVisible = index < activeStepIndex;
                  const isCurrent = index === activeStepIndex - 1 && isSimRunning;
                  return (
                    <div
                      key={step.id}
                      className={`sim-step-row ${
                        isVisible ? 'sim-step-row--visible' : 'sim-step-row--pending'
                      } ${isCurrent ? 'sim-step-row--active' : ''}`}
                    >
                      <div className="sim-step-meta">
                        <span className={`sim-phase-tag sim-phase-tag--${step.phase}`}>
                          {step.phase}
                        </span>
                        <span className="sim-step-title">{step.label}</span>
                        <span className="sim-step-latency">{step.latencyMs}ms</span>
                      </div>
                      <p className="sim-step-detail">{step.detail}</p>
                    </div>
                  );
                })}
              </div>

              {/* Final ROI Output Bar */}
              <div
                className={`sim-result-footer ${
                  activeStepIndex >= currentScenario.steps.length
                    ? 'sim-result-footer--ready'
                    : ''
                }`}
              >
                <CheckCircle2 size={16} />
                <span>{currentScenario.resultSummary}</span>
              </div>
            </div>
          </div>
        );

      case 'capabilities': {
        const currentCap =
          CAPABILITY_MODULES.find((c) => c.id === activeCapId) || CAPABILITY_MODULES[0];
        return (
          <div className="win-caps-body">
            <div
              className="caps-sidebar"
              role="tablist"
              aria-label="Enterprise AI Capability Modules"
              onKeyDown={handleSpatialKeyDown}
            >
              {CAPABILITY_MODULES.map((mod) => {
                const isSelected = mod.id === activeCapId;
                return (
                  <button
                    key={mod.id}
                    id={`cap-tab-${mod.id}`}
                    type="button"
                    role="tab"
                    data-spatial-item=""
                    tabIndex={isSelected ? 0 : -1}
                    aria-selected={isSelected}
                    aria-controls="cap-detail-tabpanel"
                    className={`caps-nav-btn ${isSelected ? 'caps-nav-btn--active' : ''}`}
                    onClick={() => setActiveCapId(mod.id)}
                  >
                    <span className="caps-nav-code">{mod.code}</span>
                    <span className="caps-nav-title">{mod.title}</span>
                    <ChevronRight size={15} className="caps-nav-arrow" />
                  </button>
                );
              })}
            </div>

            <div
              id="cap-detail-tabpanel"
              role="tabpanel"
              aria-labelledby={`cap-tab-${activeCapId}`}
              className="caps-detail-pane"
            >
              <div className="caps-detail-header">
                <span className="caps-code-pill">{currentCap.code} // PRODUCTION SPEC</span>
                <h2 className="caps-detail-title">{currentCap.title}</h2>
                <p className="caps-detail-sub">{currentCap.subtitle}</p>
              </div>

              <p className="caps-detail-desc">{currentCap.description}</p>

              <div className="caps-specs-box">
                <div className="caps-specs-title">ARCHITECTURAL CAPABILITIES</div>
                <ul className="caps-specs-list">
                  {currentCap.specs.map((spec) => (
                    <li key={spec} className="caps-spec-item">
                      <Shield size={14} className="caps-spec-icon" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="caps-deliverable-bar">
                <div>
                  <span className="caps-deliverable-label">PRIMARY DELIVERABLE</span>
                  <strong className="caps-deliverable-val">{currentCap.deliverable}</strong>
                </div>
                <button
                  type="button"
                  className="hw-btn hw-btn--primary"
                  onClick={() => openWindow('contact')}
                >
                  <span>Request Architecture Review</span>
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'protocol':
        return (
          <div className="win-protocol-body">
            <div className="protocol-intro">
              <div>
                <h2 className="protocol-heading">
                  Forward Deployed Engineering Protocol
                </h2>
                <p className="protocol-sub">
                  How I take business AI agents from operational bottleneck to production in weeks—not quarters.
                </p>
              </div>
              <span className="protocol-badge">EMBEDDED EXECUTION</span>
            </div>

            <div className="protocol-timeline">
              {FDE_STAGES.map((stage) => (
                <div key={stage.step} className="protocol-stage-card">
                  <div className="protocol-stage-top">
                    <span className="protocol-step-num">STAGE {stage.step}</span>
                    <span className="protocol-time-pill">{stage.windowTime}</span>
                  </div>
                  <h3 className="protocol-stage-title">{stage.title}</h3>
                  <p className="protocol-stage-desc">{stage.description}</p>
                  <div className="protocol-artifact">
                    <span>OUTPUT:</span>
                    <strong>{stage.artifact}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="win-contact-body">
            <div className="contact-direct-cards">
              {/* Direct Email Card */}
              <div className="contact-channel-card">
                <div className="contact-channel-top">
                  <span className="contact-channel-label">DIRECT ELECTRONIC MAIL</span>
                  <Mail size={16} />
                </div>
                <div className="contact-channel-value">{PROFILE_DATA.email}</div>
                <div className="contact-channel-actions">
                  <button
                    type="button"
                    className="hw-btn hw-btn--secondary"
                    onClick={handleCopyEmail}
                  >
                    {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedEmail ? 'Email Copied!' : 'Copy Email Address'}</span>
                  </button>
                  <a
                    href={`mailto:${PROFILE_DATA.email}`}
                    className="hw-btn hw-btn--ghost"
                  >
                    <Send size={14} />
                    <span>Open Mail Client</span>
                  </a>
                </div>
              </div>

              {/* GitHub Card */}
              <div className="contact-channel-card">
                <div className="contact-channel-top">
                  <span className="contact-channel-label">SOURCE CODE & REPOSITORIES</span>
                  <Github size={16} />
                </div>
                <div className="contact-channel-value">{PROFILE_DATA.githubHandle}</div>
                <div className="contact-channel-actions">
                  <a
                    href={PROFILE_DATA.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hw-btn hw-btn--secondary"
                  >
                    <Github size={14} />
                    <span>Visit GitHub Profile</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Agent Dispatch Composer */}
            <form
              ref={dispatchFormRef}
              className="contact-composer-box"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = buildMailtoHref();
              }}
            >
              <div className="contact-composer-header">
                <span>QUICK AGENT DEPLOYMENT DISPATCH</span>
                <span>READY TO SEND</span>
              </div>

              <div className="contact-field-group">
                <label className="contact-label">Target Business Workflow</label>
                <div className="contact-scope-pills">
                  {[
                    'Custom Operations AI Agent',
                    'ERP / CRM Autonomous Triage',
                    'Internal Knowledge & SQL Copilot',
                    'Forward Deployed Advisory'
                  ].map((scope) => (
                    <button
                      key={scope}
                      type="button"
                      className={`scope-pill ${
                        selectedScope === scope ? 'scope-pill--active' : ''
                      }`}
                      onClick={() => setSelectedScope(scope)}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>

              <div className="contact-field-group">
                <label htmlFor="dispatch-note" className="contact-label">
                  Workflow Bottleneck or Objective (Optional — Enter to transmit, Shift+Enter for new line)
                </label>
                <textarea
                  id="dispatch-note"
                  rows={2}
                  className="contact-textarea"
                  placeholder="e.g., Automate invoice reconciliation across NetSuite & Slack with human approval gates..."
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (e.nativeEvent.isComposing || e.keyCode === 229) {
                        return;
                      }
                      dispatchFormRef.current?.requestSubmit();
                    }
                  }}
                />
              </div>

              <div className="contact-dispatch-footer">
                <span className="contact-Hint">
                  Routes directly to <strong>{PROFILE_DATA.email}</strong>
                </span>
                <button type="submit" className="hw-btn hw-btn--primary">
                  <Send size={15} />
                  <span>Transmit Deployment Brief</span>
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  const desktopIcons: Array<{
    id: WindowId | 'github_ext';
    label: string;
    tag: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    action: () => void;
  }> = [
    {
      id: 'bio',
      label: 'README.md',
      tag: 'BIO',
      icon: FileText,
      action: () => openWindow('bio')
    },
    {
      id: 'simulator',
      label: 'Agent_Sim.exe',
      tag: 'LIVE',
      icon: Terminal,
      action: () => openWindow('simulator')
    },
    {
      id: 'capabilities',
      label: 'Systems.db',
      tag: 'ARCH',
      icon: Layers,
      action: () => openWindow('capabilities')
    },
    {
      id: 'protocol',
      label: 'FDE_Playbook',
      tag: 'FLOW',
      icon: GitBranch,
      action: () => openWindow('protocol')
    },
    {
      id: 'contact',
      label: 'Comms_Link',
      tag: 'MAIL',
      icon: Mail,
      action: () => openWindow('contact')
    },
    {
      id: 'github_ext',
      label: 'GitHub.lnk',
      tag: 'CODE',
      icon: Github,
      action: () => {
        window.open(PROFILE_DATA.githubUrl, '_blank', 'noopener,noreferrer');
      }
    }
  ];

  const openWindowsList = (Object.values(windows) as WindowConfig[]).filter(
    (w) => w.isOpen && !w.isMinimized
  );

  return (
    <div className="os-viewport">
      {/* Waiting / Boot Screen Overlay on Site Load */}
      {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}

      {/* Top System Bar */}
      <header className="os-menubar">
        <div className="menubar-left">
          <button
            type="button"
            className="menubar-brand-btn"
            aria-expanded={startMenuOpen}
            aria-controls="os-start-menu-popover"
            {...({ commandfor: 'os-start-menu-popover', command: 'toggle-popover' } as any)}
          >
            <Cpu size={15} className="brand-cpu-icon" />
            <span>WINDER//OS</span>
            <span className="brand-ver">v5.0</span>
          </button>

          <nav className="menubar-quick-links" aria-label="Workspace Apps">
            <button type="button" onClick={() => openWindow('bio')}>
              Profile
            </button>
            <button type="button" onClick={() => openWindow('simulator')}>
              Agent Simulator
            </button>
            <button type="button" onClick={() => openWindow('capabilities')}>
              Capabilities
            </button>
            <button type="button" onClick={() => openWindow('protocol')}>
              FDE Playbook
            </button>
            <button type="button" onClick={() => openWindow('contact')}>
              Contact
            </button>
          </nav>
        </div>

        <div className="menubar-right">
          {/* Layout Mode Switcher */}
          <div className="menubar-mode-switch" role="group" aria-label="Window Layout Mode">
            <button
              type="button"
              className={`mode-pill ${workspaceMode === 'floating' ? 'mode-pill--active' : ''}`}
              onClick={() => setWorkspaceMode('floating')}
              title="Floating PC Desktop Mode"
            >
              <Monitor size={13} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              className={`mode-pill ${workspaceMode === 'tiled' ? 'mode-pill--active' : ''}`}
              onClick={openAllShowcaseWindows}
              title="Tile All Windows in Grid"
            >
              <LayoutGrid size={13} />
              <span>Tile All</span>
            </button>
          </div>

          <div className="menubar-telemetry">
            <Activity size={13} className="telemetry-icon" />
            <span>AGENTS: ACTIVE</span>
          </div>

          <div className="menubar-clock">{clockText}</div>
        </div>
      </header>

      {/* Main PC Desktop Surface */}
      <main
        className={`os-desktop-surface ${
          workspaceMode === 'tiled' ? 'os-desktop-surface--tiled' : ''
        }`}
      >
        {/* Background Technical Watermark */}
        <div className="desktop-watermark" aria-hidden="true">
          <div className="watermark-code">WINDER SEGURA // FORWARD DEPLOYED AI ENGINEER</div>
          <div className="watermark-coords">SYS_LOC: PRODUCTION_VPC // EXP: 5_YRS</div>
        </div>

        {/* Left Desktop Icon Grid */}
        <aside
          className="desktop-icon-rail"
          role="listbox"
          aria-label="Desktop Shortcuts"
          onKeyDown={handleSpatialKeyDown}
        >
          {desktopIcons.map((item) => {
            const IconComp = item.icon;
            const isSelected = selectedIcon === item.id;
            const isWinOpen =
              item.id !== 'github_ext' && windows[item.id as WindowId]?.isOpen;
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-spatial-item=""
                tabIndex={isSelected ? 0 : -1}
                className={`desktop-icon-btn ${
                  isSelected ? 'desktop-icon-btn--selected' : ''
                }`}
                onFocus={() => setSelectedIcon(item.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIcon(item.id);
                  item.action();
                }}
              >
                <div className="desktop-icon-glyph">
                  <span className="desktop-icon-tag">{item.tag}</span>
                  <IconComp size={24} />
                  {isWinOpen && <span className="desktop-icon-running-dot" />}
                </div>
                <span className="desktop-icon-label">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Desktop Windows Layer */}
        <section className="desktop-windows-stage" aria-label="Application Windows">
          {openWindowsList.length === 0 ? (
            <div className="desktop-empty-prompt">
              <p>All workstation windows minimized or closed.</p>
              <div className="desktop-empty-actions">
                <button
                  type="button"
                  className="hw-btn hw-btn--primary"
                  onClick={resetDesktopCascade}
                >
                  Restore Default Workspace
                </button>
                <button
                  type="button"
                  className="hw-btn hw-btn--secondary"
                  onClick={openAllShowcaseWindows}
                >
                  Tile All Windows
                </button>
              </div>
            </div>
          ) : (
            openWindowsList.map((win) => {
              const IconComp = win.icon;
              const isFocused = activeWindowId === win.id;
              const floatingStyle: React.CSSProperties =
                workspaceMode === 'floating' && !win.isMaximized
                  ? {
                      left: `${win.position.x}px`,
                      top: `${win.position.y}px`,
                      width: `min(${win.width}px, calc(100dvw - ${win.position.x + 16}px))`,
                      zIndex: win.zIndex
                    }
                  : {
                      zIndex: win.zIndex
                    };

              return (
                <article
                  key={win.id}
                  style={floatingStyle}
                  className={`os-window ${isFocused ? 'os-window--focused' : ''} ${
                    win.isMaximized ? 'os-window--maximized' : ''
                  } ${workspaceMode === 'tiled' ? 'os-window--tiled' : ''}`}
                  onPointerDown={() => focusWindow(win.id)}
                  aria-label={win.subtitle}
                >
                  {/* Window Title Bar */}
                  <div
                    className="os-window-titlebar"
                    onPointerDown={(e) => handleTitlePointerDown(win.id, e)}
                  >
                    <div className="titlebar-left">
                      <span className="titlebar-active-led" />
                      <IconComp size={14} />
                      <span className="titlebar-filename">{win.filename}</span>
                      <span className="titlebar-subtitle">— {win.subtitle}</span>
                    </div>

                    <div className="titlebar-controls">
                      <button
                        type="button"
                        className="win-ctrl-btn"
                        onClick={(e) => toggleMinimizeWindow(win.id, e)}
                        aria-label={`Minimize ${win.shortTitle}`}
                        title="Minimize"
                      >
                        <Minus size={12} />
                      </button>
                      {workspaceMode === 'floating' && (
                        <button
                          type="button"
                          className="win-ctrl-btn"
                          onClick={(e) => toggleMaximizeWindow(win.id, e)}
                          aria-label={`Maximize ${win.shortTitle}`}
                          title={win.isMaximized ? 'Restore Size' : 'Maximize'}
                        >
                          {win.isMaximized ? (
                            <Minimize2 size={12} />
                          ) : (
                            <Maximize2 size={12} />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        className="win-ctrl-btn win-ctrl-btn--close"
                        onClick={(e) => closeWindow(win.id, e)}
                        aria-label={`Close ${win.shortTitle}`}
                        title="Close Window"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Window Content Canvas */}
                  <div className="os-window-content">{renderWindowContent(win.id)}</div>
                </article>
              );
            })
          )}
        </section>

        {/* Start Menu Popover */}
        <div
          id="os-start-menu-popover"
          ref={startMenuRef}
          {...({ popover: 'auto' } as any)}
          className="os-start-menu"
          role="menu"
          aria-label="WINDER//OS Start Launcher"
        >
          <div className="start-menu-banner">
            <div className="start-banner-name">{PROFILE_DATA.name}</div>
            <div className="start-banner-role">Forward Deployed AI Engineer</div>
          </div>

          <div className="start-menu-list">
            {(Object.values(windows) as WindowConfig[]).map((w) => {
              const IconComp = w.icon;
              return (
                <button
                  key={w.id}
                  type="button"
                  role="menuitem"
                  className="start-menu-item"
                  onClick={() => openWindow(w.id)}
                >
                  <IconComp size={16} />
                  <div className="start-item-text">
                    <strong>{w.shortTitle}</strong>
                    <span>{w.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="start-menu-footer">
            <button
              type="button"
              role="menuitem"
              className="start-footer-btn"
              onClick={() => {
                hideStartMenu();
                setIsBooting(true);
              }}
            >
              <Power size={14} />
              <span>Replay Waiting / Boot Screen</span>
            </button>
            <button
              type="button"
              role="menuitem"
              className="start-footer-btn"
              onClick={resetDesktopCascade}
            >
              <RotateCcw size={14} />
              <span>Reset Window Layout</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom PC Taskbar */}
      <footer className="os-taskbar">
        <div className="taskbar-left">
          <button
            type="button"
            aria-expanded={startMenuOpen}
            aria-controls="os-start-menu-popover"
            {...({ commandfor: 'os-start-menu-popover', command: 'toggle-popover' } as any)}
            className={`taskbar-start-btn ${
              startMenuOpen ? 'taskbar-start-btn--active' : ''
            }`}
          >
            <span className="start-led" />
            <span>START // CMD</span>
          </button>

          <div
            className="taskbar-window-tabs"
            role="tablist"
            aria-label="Running Applications"
            onKeyDown={handleSpatialKeyDown}
          >
            {(Object.values(windows) as WindowConfig[]).map((win) => {
              const IconComp = win.icon;
              const isFocused =
                activeWindowId === win.id && win.isOpen && !win.isMinimized;
              const isTabStop = activeWindowId === win.id;
              return (
                <button
                  key={win.id}
                  type="button"
                  role="tab"
                  aria-selected={isFocused}
                  data-spatial-item=""
                  tabIndex={isTabStop ? 0 : -1}
                  className={`taskbar-tab ${win.isOpen ? 'taskbar-tab--open' : ''} ${
                    isFocused ? 'taskbar-tab--focused' : ''
                  }`}
                  onClick={() => {
                    if (!win.isOpen || win.isMinimized) {
                      openWindow(win.id);
                    } else if (activeWindowId === win.id && workspaceMode === 'floating') {
                      toggleMinimizeWindow(win.id);
                    } else {
                      focusWindow(win.id);
                    }
                  }}
                >
                  <IconComp size={14} />
                  <span>{win.shortTitle}</span>
                  {win.isOpen && <span className="taskbar-tab-dot" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="taskbar-right">
          <a
            href={`mailto:${PROFILE_DATA.email}`}
            className="taskbar-quick-pill"
            title="Email Winder Segura"
          >
            <Mail size={13} />
            <span>{PROFILE_DATA.email}</span>
          </a>
          <a
            href={PROFILE_DATA.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="taskbar-quick-pill"
            title="GitHub Profile"
          >
            <Github size={13} />
            <span>@windersegura</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
