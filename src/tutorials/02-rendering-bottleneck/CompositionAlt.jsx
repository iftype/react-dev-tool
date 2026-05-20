import React, { useState } from 'react';

// ─── 공유 컴포넌트 (SlowComponent와 동일) ───────────────

const BreadCrumb = ({ lang }) => (
  <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.78rem', color: '#8fa3be', marginBottom: '1.5rem' }}>
    <span>{lang === 'ko' ? '장바구니' : 'Cart'}</span>
    <span>›</span>
    <span>{lang === 'ko' ? '배송' : 'Shipping'}</span>
    <span>›</span>
    <span style={{ color: '#9747FF', fontWeight: 600 }}>{lang === 'ko' ? '결제' : 'Payment'}</span>
  </div>
);

const LangButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid',
      borderColor: active ? '#9747FF' : '#E6E6E6',
      background: active ? '#F5F0FF' : 'transparent',
      color: active ? '#9747FF' : '#9A9A9A',
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

const TERMS_TEXT = {
  ko: '본 약관은 회사가 제공하는 전자결제 서비스의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
  en: 'These terms govern the use of electronic payment services provided by the Company, defining the rights, obligations, and responsibilities between the Company and the user.',
};

const TermsParagraph = ({ index, lang }) => (
  <p style={{ fontSize: '11px', color: '#9A9A9A', marginBottom: '5px', lineHeight: 1.5 }}>
    <strong style={{ color: '#6B6B6B' }}>
      {lang === 'ko' ? `제${index + 1}조` : `Art.${index + 1}`}
    </strong>{' '}
    {TERMS_TEXT[lang]}
  </p>
);

// memo 없음 — 리렌더링 그대로 받음
const TermsAndConditions = ({ lang }) => {
  const items = Array.from({ length: 200 }).map((_, i) => (
    <TermsParagraph key={i} index={i} lang={lang} />
  ));
  return (
    <div style={{ background: '#F5F0FF', border: '1px solid #E8DCFF', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, color: '#6B6B6B', fontSize: '0.82rem' }}>
          {lang === 'ko' ? '전자금융거래 이용약관 (200조)' : 'Terms of Electronic Payment (Art.200)'}
        </h4>
        <span style={{ fontSize: '0.72rem', color: '#1BC47D', fontWeight: 600 }}>✅ memo 없이 해결</span>
      </div>
      <div style={{ maxHeight: '90px', overflowY: 'auto' }}>{items}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem' }}>
        <input type="checkbox" id="agree-comp" style={{ accentColor: '#9747FF' }} />
        <label htmlFor="agree-comp" style={{ fontSize: '0.82rem', color: '#9A9A9A' }}>
          {lang === 'ko' ? '위 약관에 동의합니다' : 'I agree to the terms above'}
        </label>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// 핵심 구조:
//
//  CheckoutPage (lang 상태만 관리)
//  └── CardFormWrapper (카드 입력 state 관리, children으로 약관 받음)
//      ├── [카드 입력 폼]
//      ├── children = <TermsAndConditions lang={lang} />   ← 여기가 핵심
//      └── [결제 버튼]
//
// 카드 입력 시: CardFormWrapper만 리렌더링 → CheckoutPage X
//   → <TermsAndConditions lang={lang} /> 요소는 CheckoutPage에서 만들어졌으므로
//     참조가 그대로 → TermsAndConditions 리렌더링 없음 ✅
//
// 언어 전환 시: CheckoutPage 리렌더링 → 새 lang으로 새 요소 생성
//   → CardFormWrapper의 children이 바뀜 → TermsAndConditions 리렌더링 ✅
// ─────────────────────────────────────────────────────────────────────

const CardFormWrapper = ({ lang, children }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <div>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E1E1E', margin: '1rem 0' }}>
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

      {/* children = TermsAndConditions. 카드 입력이 바뀌어도 이 참조는 변하지 않음 */}
      {children}

      <button className="btn-primary btn-success" style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}>
        {lang === 'ko' ? '결제하기' : 'Pay Now'}
      </button>
    </div>
  );
};

export default function CompositionCheckout() {
  // lang만 여기서 관리
  const [lang, setLang] = useState('ko');

  return (
    <div className="demo-panel good" style={{ maxWidth: '480px' }}>
      <h3 className="demo-title good">결제 페이지 (Composition)</h3>
      <p className="demo-desc">
        카드 입력 state를 <code>CardFormWrapper</code> 안으로 내리고, 약관을 <code>children</code>으로 전달했습니다.<br />
        카드를 타이핑하면 <code>CheckoutPage</code>는 리렌더링되지 않으므로 약관의 참조가 동일 → 건너뜀.<br />
        언어 전환 시에는 <code>CheckoutPage</code>가 리렌더링 → 새 <code>lang</code>으로 약관이 올바르게 업데이트됩니다.
      </p>

      <PageHeader lang={lang} onLangChange={setLang} />

      {/* 약관은 CheckoutPage(lang 상태 보유)에서 생성되어 children으로 전달 */}
      <CardFormWrapper lang={lang}>
        <TermsAndConditions lang={lang} />
      </CardFormWrapper>
    </div>
  );
}
