import React, { useState, useRef } from 'react';

// ─── 동일한 상품 데이터 & 컴포넌트 ────────────────────
const PRODUCTS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: [
    '에어맥스 90', '슬림 청바지', '코튼 티셔츠', '레더 재킷',
    '버킷햇', '캔버스 백팩', '편광 선글라스', '쿼츠 시계', '카드 지갑', '웨빙 벨트',
  ][i % 10] + ` v${i + 1}`,
  price: ((i * 13 + 29) % 20 + 1) * 9000 + 9900,
  category: ['신발', '의류', '의류', '아우터', '잡화', '잡화', '잡화', '시계', '잡화', '잡화'][i % 10],
  rating: (((i * 7 + 3) % 20) / 10 + 3).toFixed(1),
}));

const CAT_COLOR = {
  신발: '#0D99FF', 의류: '#9747FF', 아우터: '#1BC47D',
  잡화: '#F24822', 시계: '#FF8C00',
};

const ProductCard = ({ name, price, category, rating }) => {
  const renderCount = useRef(0);
  renderCount.current++;
  let s = 0;
  for (let i = 0; i < 50000; i++) s += Math.sqrt(i);
  const isRerendered = renderCount.current > 1;

  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${isRerendered ? '#F24822' : '#E6E6E6'}`,
      borderRadius: '8px', padding: '0.65rem', transition: 'border-color 0.15s',
    }}>
      <p style={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E1E1E', margin: '0 0 0.35rem', lineHeight: 1.3 }}>
        {name}
      </p>
      <span style={{
        background: CAT_COLOR[category] + '18', color: CAT_COLOR[category],
        fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px',
      }}>
        {category}
      </span>
      <p style={{ color: '#F59E0B', fontSize: '0.72rem', margin: '0.3rem 0 0.15rem' }}>
        {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))} {rating}
      </p>
      <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1E1E1E', margin: '0 0 0.4rem' }}>
        {Number(price).toLocaleString()}원
      </p>
      <div style={{
        padding: '0.18rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700,
        background: isRerendered ? '#FFF5F4' : '#F6FEF9',
        color: isRerendered ? '#F24822' : '#1BC47D',
      }}>
        렌더링 {renderCount.current}회
      </div>
    </div>
  );
};

const ProductGrid = ({ products }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.45rem', marginTop: '0.75rem',
    maxHeight: '380px', overflowY: 'auto',
  }}>
    {products.map(p => <ProductCard key={p.id} {...p} />)}
  </div>
);

const SearchBar = ({ query, onChange }) => (
  <div style={{ position: 'relative' }}>
    <span style={{
      position: 'absolute', left: '0.75rem', top: '50%',
      transform: 'translateY(-50%)', color: '#9A9A9A', pointerEvents: 'none',
    }}>🔍</span>
    <input
      className="input-field"
      style={{ paddingLeft: '2.25rem' }}
      value={query}
      onChange={e => onChange(e.target.value)}
      placeholder="상품 검색..."
    />
  </div>
);

// ─────────────────────────────────────────────────────────
// 핵심 구조:
//
// SearchWrapper: query state만 관리
// ProductGrid:  GoodSearch(state 없음)에서 생성 → children으로 전달
//
// 타이핑 → SearchWrapper만 리렌더링, GoodSearch는 그대로
// → children(ProductGrid) 참조 불변 → React가 건너뜀 ✅
// ─────────────────────────────────────────────────────────

const SearchWrapper = ({ children }) => {
  const [query, setQuery] = useState('');

  return (
    <div>
      <SearchBar query={query} onChange={setQuery} />

      {query && (
        <div style={{
          marginTop: '0.5rem', padding: '0.4rem 0.75rem',
          background: '#F6FEF9', border: '1px solid #A7F0D0',
          borderRadius: '6px', fontSize: '0.8rem', color: '#0F7B4A',
        }}>
          ✅ <strong>"{query}"</strong> 타이핑 중 → SearchWrapper만 리렌더링, ProductCard 건너뜀
        </div>
      )}

      {/* children = ProductGrid (외부에서 주입) → 리렌더링 없음 */}
      {children}
    </div>
  );
};

export default function GoodSearch() {
  // state 없음 → 절대 리렌더링 안 됨
  return (
    <div className="demo-panel good">
      <h3 className="demo-title good">상품 검색 (Good)</h3>
      <p className="demo-desc">
        검색어 state를 <code>SearchWrapper</code> 안으로 격리하고, <code>ProductGrid</code>를 <code>children</code>으로 주입했습니다.<br />
        타이핑해도 카드의 <strong>렌더링 횟수가 1회에서 고정</strong>됩니다. 배경이 초록색 테두리 상태 유지.
      </p>

      {/* ProductGrid는 GoodSearch(state 없음)에서 생성됨
          → GoodSearch가 리렌더링되지 않으므로 이 요소의 참조는 항상 동일
          → SearchWrapper가 아무리 리렌더링돼도 children은 건너뜀 ✅ */}
      <SearchWrapper>
        <ProductGrid products={PRODUCTS} />
      </SearchWrapper>
    </div>
  );
}
