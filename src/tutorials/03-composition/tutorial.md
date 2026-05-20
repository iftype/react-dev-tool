# 컴포지션(Composition)을 통한 리렌더링 방지

## 상황: 카드 프리뷰 + 인터랙티브 홀로그램 배경

실제 프리미엄 카드 등록 페이지를 생각해 봅시다.  
카드 위에는 두 가지 레이어가 공존합니다.

| 레이어 | 역할 | 상태 필요 여부 |
|---|---|---|
| **홀로그램 배경** | 마우스 hover 시 각 셀이 개별 반응 | ❌ 카드 번호와 무관 |
| **텍스트 오버레이** | 입력한 카드 번호/이름 표시 | ✅ 타이핑마다 업데이트 |

> **왜 이미지/비디오로 대체할 수 없나요?**  
> 홀로그램 배경의 150개 셀은 각각 마우스 위치에 반응하는 개별 이벤트 핸들러를 가집니다.  
> 단순한 시각 효과라면 이미지로 캐싱하면 되지만, **상호작용이 필요한 순간 반드시 DOM으로 존재해야 합니다.**

---

## Bad — 같은 컴포넌트에서 상태 관리

```jsx
const CardPreview = () => {
  const [cardNumber, setCardNumber] = useState('');
  return (
    <div className="card">
      <HologramBackground />   {/* ← 타이핑마다 리렌더링 */}
      <CardText>{cardNumber}</CardText>
    </div>
  );
};
```

**Bad Structure** 탭에서 카드 번호를 입력해보세요.  
Profiler를 켜면 타이핑할 때마다 150개의 `HologramCell`이 전부 리렌더링되는 것이 보입니다.

---

## Good — 컴포지션으로 레이어 분리

핵심 아이디어: **상태를 가진 래퍼**가 **무거운 배경을 `children`으로 받아** 카드 안에 배치합니다.

```jsx
const CardInputWrapper = ({ children }) => {
  const [cardNumber, setCardNumber] = useState('');
  return (
    <div className="card">
      {children}               {/* ← 외부에서 주입, 리렌더링 없음 */}
      <CardText>{cardNumber}</CardText>
    </div>
  );
};

// 사용: HologramBackground는 상태가 없는 곳에서 생성됨
<CardInputWrapper>
  <HologramBackground />
</CardInputWrapper>
```

### 왜 `children`은 리렌더링되지 않을까요?

`children`으로 전달된 `<HologramBackground />`는 **`CardInputWrapper` 바깥(부모)에서 이미 생성된 React element**입니다.  
`cardNumber` 상태가 변해도 이 요소를 만든 부모 컴포넌트(GoodStructure)는 리렌더링되지 않으므로, React는 `children`의 참조가 동일하다고 판단하고 배경을 건너뜁니다.

**Good Structure** 탭에서 직접 타이핑해 보세요.  
카드 번호가 실시간으로 업데이트되면서도, 홀로그램 셀의 hover 인터랙션은 여전히 완벽하게 작동하는 것을 확인할 수 있습니다.
