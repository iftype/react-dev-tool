import React, { useState } from 'react';

// ─── 동일한 컴포넌트들 ─────────────────────────────

const HologramCell = ({ row, col }) => (
  <div
    style={{
      width: '100%', height: '100%',
      background: `hsl(${(row * 30 + col * 17) % 360}, 90%, 60%)`,
      opacity: 0.12,
      transition: 'opacity 0.18s ease, filter 0.18s ease',
      cursor: 'crosshair',
      borderRadius: '1px',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.filter = 'brightness(1.8) saturate(2) drop-shadow(0 0 6px currentColor)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.opacity = '0.12';
      e.currentTarget.style.filter = '';
    }}
    title={`hologram (${row},${col})`}
  />
);

const HologramBackground = () => {
  const cells = [];
  for (let r = 0; r < 10; r++)
    for (let c = 0; c < 15; c++)
      cells.push(<HologramCell key={`${r}-${c}`} row={r} col={c} />);
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden',
      background: 'linear-gradient(135deg, #052e16 0%, #064e3b 55%, #0f4c35 100%)',
      display: 'grid',
      gridTemplateColumns: 'repeat(15, 1fr)',
      gridTemplateRows: 'repeat(10, 1fr)',
    }}>
      {cells}
    </div>
  );
};

const CardChip = () => (
  <div style={{ width: '38px', height: '28px', borderRadius: '5px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', opacity: 0.9 }} />
);

const CardBrand = () => (
  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 700 }}>VISA</span>
);

const CardNumber = ({ number }) => (
  <p style={{ color: 'white', fontFamily: 'monospace', fontSize: '1.15rem', letterSpacing: '0.15em', margin: '0 0 0.6rem', textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
    {number}
  </p>
);

const CardHolder = ({ name }) => (
  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
    {name || 'CARD HOLDER'}
  </p>
);

const CardTextOverlay = ({ number, holder }) => (
  <div style={{ position: 'absolute', inset: 0, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <CardChip />
      <CardBrand />
    </div>
    <div>
      <CardNumber number={number} />
      <CardHolder name={holder} />
    </div>
  </div>
);

const CardShell = ({ children }) => (
  <div style={{
    position: 'relative',
    width: '100%', maxWidth: '360px', height: '210px',
    borderRadius: '16px', margin: '0 auto 1.5rem',
    boxShadow: '0 20px 40px rgba(5,46,22,0.4)',
  }}>
    {children}
  </div>
);

const CardField = ({ label, ...inputProps }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '0.35rem', color: '#4a6080', fontSize: '0.82rem', fontWeight: 500 }}>
      {label}
    </label>
    <input className="input-field" {...inputProps} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────
// 핵심 구조:
//
// CardInputWrapper: cardNumber/cardHolder 상태를 관리, children을 카드 내부에 배치
// HologramBackground: GoodStructure(상태 없음)에서 생성 → children으로 전달
//
// CardInputWrapper가 리렌더링되어도, children의 참조는 GoodStructure 기준으로
// 변하지 않으므로 React는 HologramBackground를 건너뜀
// ─────────────────────────────────────────────────────────────────────

const CardInputWrapper = ({ children }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const displayNumber = cardNumber.padEnd(16, '·').replace(/(.{4})/g, '$1 ').trim();

  return (
    <div>
      <CardShell>
        {/* children = HologramBackground (외부에서 주입) → 리렌더링 없음 */}
        {children}
        {/* 텍스트는 이 컴포넌트 내부 state와 연결 → 정상 업데이트 */}
        <CardTextOverlay number={displayNumber} holder={cardHolder} />
      </CardShell>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <CardField
          label="카드 번호"
          type="text" value={cardNumber}
          onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
          placeholder="숫자 16자리 입력"
        />
        <CardField
          label="카드 소유자"
          type="text" value={cardHolder}
          onChange={e => setCardHolder(e.target.value.toUpperCase())}
          placeholder="HONG GILDONG"
        />
      </div>
    </div>
  );
};

export default function GoodStructure() {
  return (
    <div className="demo-panel good">
      <h3 className="demo-title good">카드 프리뷰 (Good)</h3>
      <p className="demo-desc">
        상태를 <code>CardInputWrapper</code> 안으로 격리하고, <code>HologramBackground</code>를 <code>children</code>으로 주입했습니다.<br />
        카드 번호를 타이핑해도 150개의 <code>HologramCell</code>은 리렌더링을 건너뜁니다.<br />
        배경에 마우스를 올리면 — hover 인터랙션도 여전히 완벽하게 작동합니다.
      </p>

      {/* HologramBackground는 GoodStructure(상태 없음)에서 생성됨
          → CardInputWrapper가 아무리 리렌더링돼도 이 요소의 참조는 불변 */}
      <CardInputWrapper>
        <HologramBackground />
      </CardInputWrapper>
    </div>
  );
}
