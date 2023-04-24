# SSR을 구현해보기

CSR이란?
웹 페이지를 브라우저에 렌더링하는 전통적인 방식은 서버에서 렌더링하여브라우저로 뿌려주는 MPA(Multi Page Application) 방식이었습니다.

CSR이 등장하게 된 여러가지 이유 중 하나로, 하드웨어의 발달은 소프트웨어에서의 많은 기능들의 실현을 가능하도록 했고, 이에따라 서버의 역할이 점점더 많아지고 서버가 감당하는 부하가 커졌습니다. 이러한 서버의 부하를 줄이기 위한 여러가지 개선방안이 필요했고 CSR은 그 대안 중 하나가 되었습니다.
서버에서 rendering하여 정적 리소스를 전송하는 것이 아닌 웹 클라이언트에서 렌더링하는 방식입니다.

하나의 HTML파일과 History api를 이용하여, 여러가지 페이지들이 존재하는것 처럼 보여지게 하고, 데이터의 흐름을 제어합니다.
대표적인 CSR 프레임워크와 라이브러리로 Vuejs, React가 있습니다.

CSR방식은 서비스를 구축하는 합리적인 방법이지만 초기 로딩 속도가 느리다는 단점이 있습니다. 빈 HTML 파일에서부터 렌더링이 시작되므로 처음엔 비어있는 화면이 출력되게 되고, 이는 사용자 경험에 불이익을 줍니다. (눈이 아픔, 불편함) 그리고, SEO(Serch Engine Optimization, 검색 엔진 최적화)에도 불리한 구조입니다.

SEO - 검색 엔진 최적화
 검색 엔진의 웹 크롤러들이 지속적으로 웹을 탐색하며 검색엔진 색인에 추가할 사이트를 찾아 검색엔진에 노출되도록 함.
SSR을 사용하면 SEO를 쉽게 구축할 수 있고, 상황에 따라 더 나은 서비스를 구축 할 수 있게 됩니다.

Expressjs로 SSR 만들어보기
Server Side Rendering이기 때문에 Server가 필요합니다.
nodejs의 expressjs를 이용하여 server side rendering을 구현하고 csr의 상태관리까지 해보는 것을 목표로 합니다.
상태관리는 이전에 포스팅 한 useState 따라해보기를 활용하겠습니다.

폴더구조

Main Folder
 - app.js # server
 - package.json
 - src
   - react # csr 상태관리
     - React.js
   - index.js
   - App.js 
   - Counter.js 
   - serverRender.js # SSR html template
   - staticPage.js # SSR 콘텐츠
1. expressjs를 사용하기 위해서 pagage.json을 생성합니다.

npm init -y
2. expressjs와 nodemon을 설치합니다.

yarn add -D express nodemon
3. app.js파일을 추가하고 아래의 코드를 추가합니다.

import express from 'express';
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`listen in port ${port}`);
});
expressjs를 이용하여 3000번 포트를 사용합니다.

4. serverSideRender.js를 만들고 ssr을 구현할 html template을 문자열 형태로 만들겠습니다.

```
function serverRender(component) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div>${component ? component : ''}</div>
      </body>
     </html>
  `;
}
```
5. staticPage.js파일에 간단한 ssr 컴포넌트를 만들어 둡니다.

```
function staticPage() {
  return `
    <div>Server side rendering contents</div>
  `;
}
```

6. app.js에서 serverRender.js에 만들어 둔 template을 사용하도록 코드를 추가합니다.

```
app.get('/', (req, res) => {
  res.send(serverRender(staticPage()));
});
```

7. nodemon을 이용하여 app.js를 실행시켜 본다면 ssr 성공입니다.

8. 간단한 상태관리를 할 수 있도록 코드를 만들어 보겠습니다.
버튼을 2개 만들고 하나를 클릭하면 증가 하나를 클릭하면 감소 하고, 카운팅된 숫자를 보이도록 하겠습니다.
src 폴더 아래에 만들어 둔 상태관리 코드를 생성합니다.
https://medium.com/@myeongjun222/react-usestate-useeffect-mechanism-with-closure-1fa3da618306

9. Counter.js와 App.js를 만들어 아래의 코드를 작성합니다.

```
// Counter.js
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
// App.js
import Counter from './Counter.js';
function App() {
  return Counter();
}
```

10. 상태관리 시스템의 rendering을 위한 index.js에 render함수를 호출합니다.

```
import App from './App.js';
import React from './react/React.js';
React.render(App, document.getElementById('app'));
```

11. serverRender.js 에 작성되어 있는 template에 csr코드를 사용 할 수 있도록 id가 “app”인 태그와 script태그를 입력합니다.
```
function serverRender(component) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div>${component ? component : ''}</div> <!-- ssr 실행 -->
        <div id="app"></div> <!-- csr 실행 --> 
        <script src="./src/index.js" type="module"></script>
      </body>
     </html>
  `;
}
```
간단하게 SSR과 CSR을 사용할 수 있는 코드를 만들어 보았습니다.
