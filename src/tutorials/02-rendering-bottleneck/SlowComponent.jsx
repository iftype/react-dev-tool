import React, { useState } from 'react';

// ─── 개별 컴포넌트로 분리 → DevTools에서 각각 보임 ─────

const BreadCrumb = ({ lang }) => (
  <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.78rem', color: '#8fa3be', marginBottom: '1.5rem' }}>
    <span>{lang === 'ko' ? '장바구니' : 'Cart'}</span>
    <span>›</span>
    <span>{lang === 'ko' ? '배송' : 'Shipping'}</span>
    <span>›</span>
    <span style={{ color: '#2563eb', fontWeight: 600 }}>{lang === 'ko' ? '결제' : 'Payment'}</span>
  </div>
);

const LangButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid',
      borderColor: active ? '#ef4444' : '#dde7f3',
      background: active ? '#fff5f5' : 'transparent',
      color: active ? '#dc2626' : '#8fa3be',
      cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: active ? 600 : 400,
    }}
  >
    {label}
  </button>
);

const LangToggle = ({ lang, onChange }) => (
  <div style={{ display: 'flex', gap: '0.25rem' }}>
    <LangButton label="한국어" active={lang === 'ko'} onClick={() => onChange('ko')} />
    <LangButton label="EN"     active={lang === 'en'} onClick={() => onChange('en')} />
  </div>
);

const PageHeader = ({ lang, onLangChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0' }}>
    <BreadCrumb lang={lang} />
    <LangToggle lang={lang} onChange={onLangChange} />
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

const SubmitButton = ({ lang }) => (
  <button className="btn-primary btn-danger" style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}>
    {lang === 'ko' ? '결제하기' : 'Pay Now'}
  </button>
);

// ─── 병목의 원인: lang prop은 있지만 카드 입력 state가 바뀔 때도 리렌더링됨 ─────

const TERMS_TEXT = {
  ko: '본 약관은 회사가 제공하는 전자결제 서비스의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
  en: 'These terms govern the use of electronic payment services provided by the Company, defining the rights, obligations, and responsibilities between the Company and the user.',
};

const TermsParagraph = ({ index, lang }) => (
  <p style={{ fontSize: '11px', color: '#8fa3be', marginBottom: '5px', lineHeight: 1.5 }}>
    <strong style={{ color: '#64748b' }}>
      {lang === 'ko' ? `제${index + 1}조` : `Art.${index + 1}`}
    </strong>{' '}
    {TERMS_TEXT[lang]}
  </p>
);

const TermsAndConditions = ({ lang }) => {
  const items = Array.from({ length: 200 }).map((_, i) => (
    <TermsParagraph key={i} index={i} lang={lang} />
  ));
  return (
    <div style={{ background: '#f8fafd', border: '1px solid #dde7f3', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>
          {lang === 'ko' ? '전자금융거래 이용약관 (200조)' : 'Terms of Electronic Payment (Art.200)'}
        </h4>
        <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600 }}>⚠ memo 미적용</span>
      </div>
      <div style={{ maxHeight: '90px', overflowY: 'auto' }}>{items}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem' }}>
        <input type="checkbox" id="agree-bad" style={{ accentColor: '#2563eb' }} />
        <label htmlFor="agree-bad" style={{ fontSize: '0.82rem', color: '#8fa3be' }}>
          {lang === 'ko' ? '위 약관에 동의합니다' : 'I agree to the terms above'}
        </label>
      </div>
    </div>
  );
};

// ─── 결제 페이지 ─────────────────────────────────

export default function CheckoutPage() {
  const [lang, setLang] = useState('ko');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <div className="demo-panel bad" style={{ maxWidth: '480px' }}>
      <h3 className="demo-title bad">결제 페이지 (Bad)</h3>
      <p className="demo-desc">
        카드 번호를 타이핑할 때마다 <code>CheckoutPage</code> 전체가 리렌더링됩니다.<br />
        약관은 <code>lang</code> prop만 받지만, 입력 state가 바뀔 때도 덩달아 200개의 <code>TermsParagraph</code>가 다시 그려집니다.
      </p>

      <PageHeader lang={lang} onLangChange={setLang} />

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '1rem 0' }}>
        {lang === 'ko' ? '결제 정보 입력' : 'Payment Details'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <CardField
            label={lang === 'ko' ? '카드 번호' : 'Card Number'}
            type="text" value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            placeholder="0000 0000 0000 0000" maxLength={19}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <CardField
            label={lang === 'ko' ? '카드 소유자' : 'Card Holder'}
            type="text" value={cardHolder}
            onChange={e => setCardHolder(e.target.value)}
            placeholder="HONG GILDONG"
          />
        </div>
        <CardField
          label={lang === 'ko' ? '유효기간' : 'Expiry'}
          type="text" value={expiry}
          onChange={e => setExpiry(e.target.value)}
          placeholder="MM / YY" maxLength={7}
        />
        <CardField
          label="CVV"
          type="password" value={cvv}
          onChange={e => setCvv(e.target.value)}
          placeholder="•••" maxLength={4}
        />
      </div>

      <TermsAndConditions lang={lang} />
      <SubmitButton lang={lang} />
    </div>
  );
}
