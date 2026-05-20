# 렌더링 병목 찾기: Profiler 실전 가이드

카드 번호를 입력할 때마다 뭔가 느린 것 같습니다. 어디서 시간이 낭비되고 있는 걸까요?  
React DevTools **Profiler**로 직접 찾아봅시다.

---

## Step 1. 증상 재현

상단 **SlowComponent** 탭의 결제 페이지에서 카드 번호를 타이핑해 보세요.  
입력이 미묘하게 버벅이는 느낌이 납니다.

---

## Step 2. Profiler로 녹화

1. 브라우저 개발자도구 → **⚛️ Profiler** 탭
2. ⚙️ 설정 → **"Record why each component rendered"** 체크
3. 🔴 **Record** 클릭
4. 카드 번호 입력창에 숫자를 타이핑
5. ⏹ **Stop** 클릭

---

## Step 3. Flamegraph 분석

**Ranked** 탭으로 전환하면 렌더링이 오래 걸린 순으로 정렬됩니다.

> 💡 `TermsAndConditions`와 그 안의 수백 개 `TermsParagraph`가 상단을 가득 채웁니다.  
> 오른쪽 "Why did this render?" → **"The parent component rendered"**  
> 카드 입력과 전혀 무관한 약관이, 부모가 리렌더링됐다는 이유 하나만으로 다시 그려지고 있습니다.

---

## Step 4. 핵심 질문 — 왜 memo가 필요한가?

`TermsAndConditions`는 **`lang` prop을 받습니다.**  
언어 토글을 클릭할 때는 → 실제로 리렌더링되어 한/영 전환이 되어야 합니다.  
카드 번호를 타이핑할 때는 → 전혀 리렌더링될 이유가 없습니다.

만약 `lang` prop이 없었다면, 약관 컴포넌트를 부모 밖으로 꺼내거나 상태를 내리는 것으로 해결할 수 있습니다.  
하지만 **props는 있고, 그 props가 드물게 바뀌는 상황** — 이게 `React.memo`가 진짜 필요한 순간입니다.

---

## Step 5. 해결 → `React.memo` 적용

```jsx
// Before
const TermsAndConditions = ({ lang }) => { ... };

// After — props가 실제로 바뀔 때만 리렌더링
const TermsAndConditions = memo(({ lang }) => { ... });
```

`memo`는 이전 props와 현재 props를 얕은 비교(shallow compare)합니다.  
- `lang`이 바뀌면 → 리렌더링 ✅ (언어 전환 정상 작동)  
- `cardNumber`가 바뀌면 → `lang`이 그대로이므로 건너뜀 ✅

---

## Step 6. 다시 녹화해서 비교

**Solution** 탭에서 동일하게 녹화해 보세요.  
Ranked 차트에서 `TermsAndConditions`가 사라지고,  
언어 토글을 클릭할 때만 정상적으로 나타나는 것을 확인할 수 있습니다.
