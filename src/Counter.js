import { useState, useDocument } from './react/React.js';

function Counter() {
  const [count, setCount] = useState(0);

  useDocument(() => {
    const increase = document.getElementsByClassName('btn')[0];
    const decrease = document.getElementsByClassName('btn')[1];
    if (increase && decrease) {
      increase.addEventListener('click', () => {
        setCount(count + 1);
      });
      decrease.addEventListener('click', () => {
        setCount(count - 1);
      });
    }
  });

  return `
    <div>${count}</div>
    <button class="btn">증가</button>
    <button class="btn">감소</button>
  `;
}

export default Counter;
