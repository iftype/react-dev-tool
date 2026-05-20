import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FILE_SECTIONS = [
  {
    filename: 'BadStructure.jsx',
    badge: '❌ 문제',
    badgeColor: '#F24822',
    desc: 'query state가 BadSearch에 있어 ProductGrid가 타이핑마다 덩달아 리렌더링됩니다.',
    code: `// ─── 의도적으로 무거운 컴포넌트 ─────────────────────────

const ProductCard = ({ name, price, category, rating }) => {
  const renderCount = useRef(0);
  renderCount.current++; // 렌더링 횟수 카운트

  // 렌더링마다 실행되는 무거운 연산
  let sum = 0;
  for (let i = 0; i < 50000; i++) sum += Math.sqrt(i);

  return (
    <div style={{ border: renderCount.current > 1 ? '1.5px solid red' : '1.5px solid #E6E6E6' }}>
      <p>{name}</p>
      <p>{price.toLocaleString()}원</p>
      <div>렌더링 {renderCount.current}회</div> {/* ← 핵심 지표 */}
    </div>
  );
};

// ProductCard 30개를 그리는 그리드
const ProductGrid = ({ products }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
    {products.map(p => <ProductCard key={p.id} {...p} />)}
  </div>
);

// ─── 문제의 구조 ──────────────────────────────────────────

export default function BadSearch() {
  const [query, setQuery] = useState(''); // query state가 여기 있음

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />

      {/* ⚠️ 문제 포인트
          - ProductGrid는 query를 props로 받지도 않음
          - 하지만 부모(BadSearch)가 리렌더링되면 덩달아 리렌더링
          - → ProductCard 30개 × 무거운 연산 = 심각한 버벅임 */}
      <ProductGrid products={PRODUCTS} />
    </div>
  );
}`,
  },
  {
    filename: 'GoodStructure.jsx',
    badge: '✅ Composition',
    badgeColor: '#1BC47D',
    desc: 'query state를 SearchWrapper 안으로 격리하고, ProductGrid를 children으로 주입합니다.',
    code: `// ─── query state를 격리하는 래퍼 ─────────────────────────

const SearchWrapper = ({ children }) => {
  const [query, setQuery] = useState(''); // query state가 여기로 이동

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />

      {/* ✨ 핵심: ProductGrid는 children으로 주입됨
          
          타이핑 시 흐름:
          1. query 변경 → SearchWrapper 리렌더링
          2. GoodSearch(부모)는 리렌더링되지 않음
          3. → children 요소의 참조가 그대로 유지됨
          4. → React: "ProductGrid 변화 없음" → 리렌더링 건너뜀 ✅

          렌더링 횟수 = 1회에서 고정됨 */}
      {children}
    </div>
  );
};

// ─── 상태가 없는 GoodSearch ───────────────────────────────

export default function GoodSearch() {
  // state 없음 → 이 컴포넌트는 절대 리렌더링 안 됨
  // → ProductGrid를 여기서 생성하면 참조가 항상 동일

  return (
    <SearchWrapper>
      {/* 이 요소는 GoodSearch 기준으로 생성됨
          GoodSearch가 리렌더링되지 않으므로
          이 참조는 항상 동일
          → SearchWrapper 내부에서 query가 아무리 바뀌어도
          → ProductGrid는 리렌더링되지 않음 ✅ */}
      <ProductGrid products={PRODUCTS} />
    </SearchWrapper>
  );
}

// ─── 왜 memo를 쓰지 않았나? ──────────────────────────────
//
// ProductGrid에는 외부 prop(query)이 없음
// props가 없는 컴포넌트는 composition으로 해결하는 것이 더 자연스러움
//
// memo는 "props가 있는데 드물게 바뀌는" 경우에 적합 (← 02번 예제)
// composition은 "state와 완전히 분리된" 경우에 적합 (← 지금 이 경우)`,
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

export default function CodeView03() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E1E1E', marginBottom: '0.25rem' }}>
          코드로 이해하기 — 03. 컴포지션 최적화
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>
          파일별로 핵심 코드를 단순화했습니다. 주석을 따라 읽어보세요.
        </p>
      </div>

      {/* memo vs composition 비교표 */}
      <div style={{
        background: '#FAFAFA', border: '1px solid #E6E6E6',
        borderRadius: '10px', padding: '1rem 1.25rem',
      }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E1E1E', marginBottom: '0.6rem' }}>
          memo vs Composition — 언제 어떤 걸 쓰나?
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.35rem 0.75rem', borderBottom: '1px solid #E6E6E6', color: '#6B6B6B' }}>상황</th>
              <th style={{ textAlign: 'left', padding: '0.35rem 0.75rem', borderBottom: '1px solid #E6E6E6', color: '#6B6B6B' }}>해결책</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.35rem 0.75rem', borderBottom: '1px solid #F0F0F0', color: '#1E1E1E' }}>props가 있고, 드물게 바뀜 (예: lang)</td>
              <td style={{ padding: '0.35rem 0.75rem', borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ color: '#1BC47D', fontWeight: 700 }}>React.memo</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.35rem 0.75rem', color: '#1E1E1E' }}>props가 없거나, 자주 바뀌는 state와 무관</td>
              <td style={{ padding: '0.35rem 0.75rem' }}>
                <span style={{ color: '#0D99FF', fontWeight: 700 }}>Composition (children)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {FILE_SECTIONS.map((sec, i) => (
        <div key={i} style={{ border: '1px solid #E6E6E6', borderRadius: '10px', overflow: 'hidden' }}>
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

          <div style={{ padding: '0.65rem 1.25rem', background: '#FAFFFE', borderBottom: '1px solid #E6E6E6', fontSize: '0.82rem', color: '#4A6080' }}>
            {sec.desc}
          </div>

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
