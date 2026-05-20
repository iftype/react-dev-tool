import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './index.css';

import introMd       from './tutorials/01-introduction/tutorial.md?raw';
import bottleneckMd  from './tutorials/02-rendering-bottleneck/tutorial.md?raw';
import compositionMd from './tutorials/03-composition/tutorial.md?raw';

import BottleneckSlow       from './tutorials/02-rendering-bottleneck/SlowComponent';
import BottleneckSolution   from './tutorials/02-rendering-bottleneck/Solution';
import BottleneckComposition from './tutorials/02-rendering-bottleneck/CompositionAlt';
import CompositionBad       from './tutorials/03-composition/BadStructure';
import CompositionGood    from './tutorials/03-composition/GoodStructure';

// ── Tutorial registry ────────────────────────────────
const TUTORIALS = [
  {
    id: 'intro', shortTitle: 'DevTools 소개',
    title: '01. React DevTools 소개',
    md: introMd, type: 'markdown',
  },
  {
    id: 'bottleneck', shortTitle: '렌더링 병목',
    title: '02. 렌더링 병목 현상',
    md: bottleneckMd, type: 'component',
    components: [
      { label: 'SlowComponent',       component: <BottleneckSlow /> },
      { label: 'Solution (memo)',      component: <BottleneckSolution /> },
      { label: 'Solution (composition)', component: <BottleneckComposition /> },
    ],
  },
  {
    id: 'composition', shortTitle: '컴포지션',
    title: '03. 컴포지션 최적화',
    md: compositionMd, type: 'component',
    components: [
      { label: 'Bad Structure',  component: <CompositionBad /> },
      { label: 'Good Structure', component: <CompositionGood /> },
    ],
  },
];

const BADGE_COLORS = ['nav-item-badge-1', 'nav-item-badge-2', 'nav-item-badge-3'];
const STEP_BADGE   = ['step-badge-1',     'step-badge-2',     'step-badge-3'];

// ── Markdown renderer ────────────────────────────────
const MD = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={oneLight}
        language={match[1]}
        PreTag="div"
        customStyle={{
          borderRadius: '8px',
          fontSize: '0.78rem',
          margin: '0.6rem 0',
          border: '1px solid #E6E6E6',
          boxShadow: 'none',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code
        style={{
          background: '#F5F0FF',
          color: '#9747FF',
          padding: '0.1em 0.35em',
          borderRadius: '3px',
          fontSize: '0.8em',
          fontFamily: "'SF Mono','Fira Code',monospace",
          border: '1px solid #E8DCFF',
        }}
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.82rem', border: '1px solid #E6E6E6', borderRadius: '6px', overflow: 'hidden' }}>
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th style={{ background: '#FAFAFA', color: '#1E1E1E', fontWeight: 600, padding: '0.45rem 0.75rem', borderBottom: '1px solid #E6E6E6', textAlign: 'left' }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '0.45rem 0.75rem', borderBottom: '1px solid #E6E6E6', color: '#6B6B6B' }}>
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '2px solid #9747FF', background: '#FAFAFF', padding: '0.6rem 0.875rem', borderRadius: '0 6px 6px 0', margin: '0.75rem 0' }}>
      {children}
    </blockquote>
  ),
};

// ── App ──────────────────────────────────────────────
export default function App() {
  const [activeId, setActiveId]   = useState(TUTORIALS[0].id);
  const [subTabIdx, setSubTabIdx] = useState(0);

  const current = TUTORIALS.find(t => t.id === activeId);
  const activeIdx = TUTORIALS.findIndex(t => t.id === activeId);

  function switchTutorial(id) {
    setActiveId(id);
    setSubTabIdx(0);
  }

  return (
    <div className="app-root">
      {/* ── Top app bar (Figma toolbar style) ──────── */}
      <header className="app-bar">
        {/* Figma multi-color logo dots */}
        <div className="app-bar-logo">
          <div className="app-bar-logo-dot" style={{ background: '#F24822' }} />
          <div className="app-bar-logo-dot" style={{ background: '#FF7262' }} />
          <div className="app-bar-logo-dot" style={{ background: '#A259FF' }} />
          <div className="app-bar-logo-dot" style={{ background: '#1ABCFE' }} />
          <div className="app-bar-logo-dot" style={{ background: '#0ACF83' }} />
        </div>
        <div className="app-bar-divider" />
        <span className="app-bar-title">
          React DevTools Profiling Tutorial
          {current && (
            <span style={{ color: '#9A9A9A' }}> — {current.title}</span>
          )}
        </span>
      </header>

      {/* ── Mobile step nav (visible only < 768px) ──── */}
      <nav className="mobile-step-nav">
        {TUTORIALS.map((tut, i) => (
          <button
            key={tut.id}
            className={`mobile-step-pill ${activeId === tut.id ? 'active' : ''}`}
            onClick={() => switchTutorial(tut.id)}
          >
            <span className={`step-badge ${STEP_BADGE[i]}`}>{i + 1}</span>
            {tut.shortTitle}
          </button>
        ))}
      </nav>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="app-body">
        {/* Desktop sidebar */}
        <nav className="sidebar">
          <span className="sidebar-section-label">Tutorials</span>
          {TUTORIALS.map((tut, i) => (
            <button
              key={tut.id}
              className={`nav-item ${activeId === tut.id ? 'active' : ''}`}
              onClick={() => switchTutorial(tut.id)}
            >
              <span className={`nav-item-badge ${BADGE_COLORS[i]}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {tut.shortTitle}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="content-area" key={activeId}>
          <div className="content-inner">
            {/* Sub-tabs (Bad / Good) */}
            {current.type === 'component' && (
              <div className="tabs">
                {current.components.map((comp, idx) => (
                  <button
                    key={idx}
                    className={`tab ${subTabIdx === idx ? 'active' : ''}`}
                    onClick={() => setSubTabIdx(idx)}
                  >
                    {comp.label}
                  </button>
                ))}
              </div>
            )}

            {/* Markdown */}
            <div className="markdown-body">
              <ReactMarkdown components={MD}>{current.md}</ReactMarkdown>
            </div>

            {/* Demo component */}
            {current.type === 'component' && (
              <div>{current.components[subTabIdx].component}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
