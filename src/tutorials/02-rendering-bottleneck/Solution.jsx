import React, { useState, memo } from 'react';

const BreadCrumb = ({ lang }) => (
  <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.78rem', color: '#8fa3be', marginBottom: '1.5rem' }}>
    <span>{lang === 'ko' ? '장바구니' : 'Cart'}</span>
    <span>›</span>
    <span>{lang === 'ko' ? '배송' : 'Shipping'}</span>
    <span>›</span>
    <span style={{ color: '#16a34a', fontWeight: 600 }}>{lang === 'ko' ? '결제' : 'Payment'}</span>
  </div>
);

const LangButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid',
      borderColor: active ? '#16a34a' : '#dde7f3',
      background: active ? '#f0fdf4' : 'transparent',
      color: active ? '#16a34a' : '#8fa3be',
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
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
  <button className="btn-primary btn-success" style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}>
    {lang === 'ko' ? '결제하기' : 'Pay Now'}
  </button>
);

// ─── React.memo 적용: lang이 바뀔 때만 리렌더링, 카드 입력 시 건너뜀 ─────

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

const TermsAndConditions = memo(({ lang }) => {
  const items = Array.from({ length: 200 }).map((_, i) => (
    <TermsParagraph key={i} index={i} lang={lang} />
  ));
  return (
    <div style={{ background: '#f8fafd', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>
          {lang === 'ko' ? '전자금융거래 이용약관 (200조)' : 'Terms of Electronic Payment (Art.200)'}
        </h4>
        <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>✅ memo 적용됨</span>
      </div>
      <div style={{ maxHeight: '90px', overflowY: 'auto' }}>{items}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem' }}>
        <input type="checkbox" id="agree-good" style={{ accentColor: '#2563eb' }} />
        <label htmlFor="agree-good" style={{ fontSize: '0.82rem', color: '#8fa3be' }}>
          {lang === 'ko' ? '위 약관에 동의합니다' : 'I agree to the terms above'}
        </label>
      </div>
    </div>
  );
});

export default function CheckoutPageFixed() {
  const [lang, setLang] = useState('ko');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <div className="demo-panel good" style={{ maxWidth: '480px' }}>
      <h3 className="demo-title good">결제 페이지 (Good)</h3>
      <p className="demo-desc">
        <code>TermsAndConditions</code>를 <code>React.memo</code>로 감쌌습니다.<br />
        카드를 타이핑해도 약관은 리렌더링되지 않고, 언어 토글을 누르면 올바르게 전환됩니다.
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
