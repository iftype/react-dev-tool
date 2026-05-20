import React, { useState } from 'react';

// ─── 홀로그램 배경 (마우스 hover 개별 반응 → 이미지 불가) ─────

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
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #1e3a5f 100%)',
      display: 'grid',
      gridTemplateColumns: 'repeat(15, 1fr)',
      gridTemplateRows: 'repeat(10, 1fr)',
    }}>
      {cells}
    </div>
  );
};

// ─── 카드 텍스트 레이어 ─────────────────────────────

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
    boxShadow: '0 20px 40px rgba(30,27,75,0.35)',
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

// ─── BadStructure: 상태가 외부에 있어 HologramBackground까지 리렌더링됨 ─────

export default function BadStructure() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const displayNumber = cardNumber.padEnd(16, '·').replace(/(.{4})/g, '$1 ').trim();

  return (
    <div className="demo-panel bad">
      <h3 className="demo-title bad">카드 프리뷰 (Bad)</h3>
      <p className="demo-desc">
        카드 번호를 입력할 때마다 <code>BadStructure</code> 전체가 리렌더링됩니다.<br />
        그 결과 <code>HologramBackground</code> 내부의 150개 <code>HologramCell</code>도 전부 다시 그려집니다.<br />
        배경에 마우스를 올려보세요 — 각 셀이 개별 반응하는 것이 이미지로 대체할 수 없는 이유입니다.
      </p>

      <CardShell>
        <HologramBackground />
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
}
