import React, { useEffect, useState } from 'react';
import { BOOT_LOG_LINES, PROFILE_DATA } from '../data/workstationData';
import { Cpu, ShieldCheck, Terminal, Zap, ArrowRight } from 'lucide-react';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(1);
  const [isExiting, setIsExiting] = useState(false);

  const finishBoot = () => {
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(() => {
      onComplete();
    }, 340);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        finishBoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  useEffect(() => {
    const totalDuration = 2300; // Fast, crisp 2.3s boot ceremony
    const intervalMs = 35;
    const step = 100 / (totalDuration / intervalMs);

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + step);
        const targetLines = Math.max(
          1,
          Math.ceil((next / 100) * BOOT_LOG_LINES.length)
        );
        setVisibleLines(targetLines);

        if (next >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => {
            finishBoot();
          }, 260);
        }
        return next;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, []);

  const subsystems = [
    { name: 'AGENT_ORCHESTRATOR', status: progress > 22 ? 'READY' : 'INIT', icon: Cpu },
    { name: 'TOOL_SANDBOX_MCP', status: progress > 48 ? 'VERIFIED' : 'SYNC', icon: Terminal },
    { name: 'GUARDRAIL_ENGINE', status: progress > 72 ? 'LOCKED' : 'CHECK', icon: ShieldCheck },
    { name: 'DESKTOP_SHELL_UI', status: progress >= 95 ? 'ONLINE' : 'LOAD', icon: Zap }
  ];

  return (
    <div
      className={`boot-overlay ${isExiting ? 'boot-overlay--exiting' : ''}`}
      role="dialog"
      aria-label="WINDER//OS Workstation Initialization Screen"
    >
      <div className="boot-scanlines" aria-hidden="true" />

      <div className="boot-chassis">
        {/* Top Hardware Header */}
        <header className="boot-header">
          <div className="boot-brand">
            <span className="boot-led" />
            <span className="boot-title">WINDER//OS BIOS v5.04 — FIELD WORKSTATION</span>
          </div>
          <div className="boot-meta">
            <span>OPERATOR: {PROFILE_DATA.name.toUpperCase()}</span>
            <span className="boot-divider">|</span>
            <span>EXP: 5 YEARS FDE</span>
          </div>
        </header>

        {/* Main Diagnostic Body */}
        <div className="boot-body">
          <div className="boot-identity-banner">
            <div>
              <p className="boot-eyebrow">AUTONOMOUS ENTERPRISE AI DEPLOYMENT UNIT</p>
              <h1 className="boot-headline">
                Initializing Forward-Deployed Agent Environment...
              </h1>
            </div>
            <div className="boot-pct-readout" aria-live="polite">
              {Math.round(progress).toString().padStart(3, '0')}%
            </div>
          </div>

          {/* Hardware Progress Track */}
          <div className="boot-progress-track" aria-hidden="true">
            <div
              className="boot-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 4-Column Subsystem Telemetry */}
          <div className="boot-subsystem-grid">
            {subsystems.map((sub) => {
              const IconComponent = sub.icon;
              const isReady =
                sub.status === 'READY' ||
                sub.status === 'VERIFIED' ||
                sub.status === 'LOCKED' ||
                sub.status === 'ONLINE';
              return (
                <div
                  key={sub.name}
                  className={`boot-subsystem-card ${isReady ? 'boot-subsystem-card--ready' : ''}`}
                >
                  <div className="boot-subsystem-top">
                    <IconComponent size={15} />
                    <span className="boot-subsystem-name">{sub.name}</span>
                  </div>
                  <div className="boot-subsystem-status">
                    <span className="boot-status-dot" />
                    {sub.status}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Boot Log Stream */}
          <div className="boot-terminal-box">
            <div className="boot-terminal-header">
              <span>/var/log/winder_agent_kernel.log</span>
              <span>TTY1 // UTF-8</span>
            </div>
            <div className="boot-terminal-lines">
              {BOOT_LOG_LINES.slice(0, visibleLines).map((line, idx) => (
                <div key={line.time} className="boot-log-row">
                  <span className="boot-log-time">[{line.time}]</span>
                  <span className="boot-log-tag">{line.tag}</span>
                  <span className="boot-log-text">
                    {line.text}
                    {idx === visibleLines - 1 && progress < 100 && (
                      <span className="boot-cursor" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <footer className="boot-footer">
          <div className="boot-footer-hint">
            <span>PRESS [ENTER] OR CLICK TO ENTER WORKSTATION IMMEDIATELY</span>
          </div>
          <button
            type="button"
            onClick={finishBoot}
            className="boot-skip-btn"
          >
            <span>Enter Desktop Now</span>
            <ArrowRight size={15} />
          </button>
        </footer>
      </div>
    </div>
  );
};
