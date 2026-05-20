import React, { useState, useRef } from 'react';

// ─── 30개 가상 상품 데이터 ─────────────────────────────
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

// ─── 의도적으로 무거운 컴포넌트 ────────────────────────
const ProductCard = ({ name, price, category, rating }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  // 인위적인 무거운 연산
  let s = 0;
  for (let i = 0; i < 50000; i++) s += Math.sqrt(i);

  const isRerendered = renderCount.current > 1;

  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${isRerendered ? '#F24822' : '#E6E6E6'}`,
      borderRadius: '8px', padding: '0.65rem',
      transition: 'border-color 0.15s',
    }}>
      <p style={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E1E1E', margin: '0 0 0.35rem', lineHeight: 1.3 }}>
        {name}
      </p>
      <span style={{
        background: CAT_COLOR[category] + '18', color: CAT_COLOR[category],
        fontSize: '0.65rem', fontWeight: 700,
        padding: '0.1rem 0.4rem', borderRadius: '4px',
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

// ─── BadSearch: query state가 바깥에 있어 ProductGrid가 덩달아 리렌더링 ─────

export default function BadSearch() {
  const [query, setQuery] = useState('');

  return (
    <div className="demo-panel bad">
      <h3 className="demo-title bad">상품 검색 (Bad)</h3>
      <p className="demo-desc">
        검색어를 타이핑할 때마다 <code>BadSearch</code> 전체가 리렌더링됩니다.<br />
        <code>ProductGrid</code>는 검색어를 전혀 사용하지 않는데도 <code>ProductCard</code> 30개가 전부 다시 그려집니다.<br />
        각 카드의 <strong>렌더링 횟수</strong>가 올라가는 것을 확인해보세요.
      </p>

      <SearchBar query={query} onChange={setQuery} />

      {query && (
        <div style={{
          marginTop: '0.5rem', padding: '0.4rem 0.75rem',
          background: '#FFF5F4', border: '1px solid #FFCDC7',
          borderRadius: '6px', fontSize: '0.8rem', color: '#C73B1B',
        }}>
          ⚠️ <strong>"{query}"</strong> 타이핑 중 → ProductCard 30개 전부 리렌더링
        </div>
      )}

      {/* ← 문제: ProductGrid가 query를 쓰지 않아도 부모가 리렌더링되면 따라서 리렌더링 */}
      <ProductGrid products={PRODUCTS} />
    </div>
  );
}
