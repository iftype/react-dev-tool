import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FILE_SECTIONS = [
  {
    filename: 'SlowComponent.jsx',
    badge: '❌ 문제',
    badgeColor: '#F24822',
    desc: 'cardNumber state가 바뀌면 TermsAndConditions도 무조건 리렌더링됩니다.',
    code: `// CheckoutPage: lang + 카드 입력 state가 한 곳에 모여 있음
export default function CheckoutPage() {
  const [lang, setLang] = useState('ko');          // 언어 state
  const [cardNumber, setCardNumber] = useState(''); // 카드 번호 state
  const [cardHolder, setCardHolder] = useState(''); // 카드 소유자 state
  const [expiry,     setExpiry]     = useState('');
  const [cvv,        setCvv]        = useState('');

  return (
    <div>
      {/* 언어 전환 */}
      <LangToggle lang={lang} onChange={setLang} />

      {/* 카드 입력 */}
      <CardField value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
      <CardField value={cardHolder} onChange={e => setCardHolder(e.target.value)} />

      {/* ⚠️ 문제 포인트
          - TermsAndConditions는 lang prop만 사용함
          - 하지만 cardNumber가 바뀌면 CheckoutPage 전체가 리렌더링됨
          - → TermsAndConditions도 덩달아 리렌더링
          - → 내부의 TermsParagraph 200개가 전부 다시 그려짐 */}
      <TermsAndConditions lang={lang} />
    </div>
  );
}

// memo 미적용 → 부모가 리렌더링되면 무조건 따라서 리렌더링
const TermsAndConditions = ({ lang }) => {
  return (
    <div>
      {Array.from({ length: 200 }).map((_, i) => (
        <TermsParagraph key={i} index={i} lang={lang} />
      ))}
    </div>
  );
};`,
  },
  {
    filename: 'Solution.jsx',
    badge: '✅ React.memo',
    badgeColor: '#1BC47D',
    desc: 'memo로 감싸면 props가 실제로 바뀔 때만 리렌더링됩니다. 코드 1줄 추가.',
    code: `// TermsAndConditions를 memo로 감싸기
const TermsAndConditions = memo(({ lang }) => {
  //                      ↑ memo가 하는 일:
  //    이전 props와 현재 props를 얕은 비교(shallow compare)
  //    - lang이 같으면 → 리렌더링 건너뜀 ✅  (카드 타이핑 시)
  //    - lang이 바뀌면 → 리렌더링 실행   ✅  (언어 전환 시)
  return (
    <div>
      {Array.from({ length: 200 }).map((_, i) => (
        <TermsParagraph key={i} index={i} lang={lang} />
      ))}
    </div>
  );
});

// CheckoutPage는 변경 없음 — memo 적용만으로 해결
export default function CheckoutPageFixed() {
  const [lang,       setLang]       = useState('ko');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  return (
    <div>
      <LangToggle lang={lang} onChange={setLang} />
      <CardField value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
      <CardField value={cardHolder} onChange={e => setCardHolder(e.target.value)} />

      {/* 카드 번호 타이핑 → lang 변화 없음 → memo가 리렌더링 차단 ✅
          언어 전환       → lang 변화   → memo가 리렌더링 허용 ✅ */}
      <TermsAndConditions lang={lang} />
    </div>
  );
}`,
  },
  {
    filename: 'CompositionAlt.jsx',
    badge: '✅ Composition',
    badgeColor: '#0D99FF',
    desc: 'memo 없이 구조 변경으로 해결. 카드 state를 하위 컴포넌트로 내리고, 약관을 children으로 주입.',
    code: `// ─── 카드 입력 state를 하위 컴포넌트로 이동 ─────────────

const CardFormWrapper = ({ lang, children }) => {
  // 카드 관련 state를 여기서 관리
  // (CheckoutPage에서 꺼냄)
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvv,        setCvv]        = useState('');

  return (
    <div>
      <CardField value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
      <CardField value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
      <CardField value={expiry}     onChange={e => setExpiry(e.target.value)}     />
      <CardField value={cvv}        onChange={e => setCvv(e.target.value)}        />

      {/* ✨ children으로 주입된 TermsAndConditions
          - cardNumber 타이핑 → CardFormWrapper만 리렌더링
          - CheckoutPage는 리렌더링되지 않음
          - → 이 children 요소의 참조가 그대로 유지됨
          - → React가 리렌더링 불필요로 판단 → 건너뜀 ✅
          
          - 언어 전환 → CheckoutPage 리렌더링 → 새 lang으로 새 요소 생성
          - → children이 바뀜 → TermsAndConditions 올바르게 리렌더링 ✅ */}
      {children}
    </div>
  );
};

// ─── lang state만 남은 CheckoutPage ─────────────────────

export default function CompositionCheckout() {
  const [lang, setLang] = useState('ko');
  // cardNumber 등의 state가 사라짐 → 카드 입력 시 이 컴포넌트는 리렌더링 안 됨

  return (
    <div>
      <LangToggle lang={lang} onChange={setLang} />

      <CardFormWrapper lang={lang}>
        {/* 이 요소는 CheckoutPage 기준으로 생성됨
            카드 번호 입력 → CardFormWrapper만 리렌더링
            → CheckoutPage는 그대로 → 이 요소 참조 불변 → 약관 건너뜀 ✅

            언어 전환 → CheckoutPage 리렌더링 → 새 lang으로 새 요소 생성
            → children이 바뀜 → 약관 올바르게 리렌더링 ✅ */}
        <TermsAndConditions lang={lang} />
      </CardFormWrapper>
    </div>
  );
}`,
  },
];

const codeStyle = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    fontSize: '0.85rem',
    lineHeight: '1.65',
  },
};

export default function CodeView02() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E1E1E', marginBottom: '0.25rem' }}>
          코드로 이해하기 — 02. 렌더링 병목 현상
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>
          파일별로 핵심 코드를 단순화했습니다. 주석을 따라 읽어보세요.
        </p>
      </div>

      {FILE_SECTIONS.map((sec, i) => (
        <div key={i} style={{ border: '1px solid #E6E6E6', borderRadius: '10px', overflow: 'hidden' }}>
          {/* 파일 헤더 */}
          <div style={{
            padding: '0.75rem 1.25rem',
            background: '#FAFAFA',
            borderBottom: '1px solid #E6E6E6',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#9A9A9A', fontFamily: 'monospace' }}>📁</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.88rem', color: '#1E1E1E' }}>
              {sec.filename}
            </span>
            <span style={{
              marginLeft: 'auto',
              background: sec.badgeColor + '18',
              color: sec.badgeColor,
              fontSize: '0.72rem', fontWeight: 700,
              padding: '0.15rem 0.6rem', borderRadius: '4px',
            }}>
              {sec.badge}
            </span>
          </div>

          {/* 설명 */}
          <div style={{ padding: '0.65rem 1.25rem', background: '#FAFFFE', borderBottom: '1px solid #E6E6E6', fontSize: '0.82rem', color: '#4A6080' }}>
            {sec.desc}
          </div>

          {/* 코드 블럭 */}
          <SyntaxHighlighter
            language="jsx"
            style={codeStyle}
            customStyle={{
              margin: 0, borderRadius: 0,
              fontSize: '0.85rem', lineHeight: '1.65',
              padding: '1.25rem 1.5rem',
              background: '#FEFEFE',
            }}
            showLineNumbers
            lineNumberStyle={{ color: '#C7C7C7', minWidth: '2.5em', userSelect: 'none' }}
          >
            {sec.code}
          </SyntaxHighlighter>
        </div>
      ))}
    </div>
  );
}
