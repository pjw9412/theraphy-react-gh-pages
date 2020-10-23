import React from 'react';
import Upload from './Upload';

function App() {
    // 클라이언트 사이드(react)에서 프록시를 통해 서버 사이드(node.js)로 데이터 요청
    // componetDidMount는 첫 렌더링이 완료된 후 진행되며 fetch를 이용하여 서버 사이드로 url 요청을 할 수 있다.
    // 요청한 데이터(title)을 받아서 setState()를 이용하여 state를 변경하면 리액트 앱은 다시 렌더링하여 웹 페이지에 표시.

    // useEffect(() => {
    //   fetch("http://localhost:3001/testTitle")
    //     .then((res) => res.json())
    //     .then((title) => setTitle(title));
    // }, []);

    // fetch('request url', {
    //   method: 'POST',
    //   body,
    // }).then((res) => {
    //   //...
    // });

    // axios.post('request url', data)
    // .then(function (res) {
    //   //...
    // })

    // 컴포넌트가 처음 렌더링 될 때 무엇을 하겠다 = useEffect
    // useEffect(() => {
    //     const response = axios.get('http://localhost:3001/testTitle');
    //     console.log('axios get from App.js');
    //     console.log(response);
    // }, []);

    return (
        <>
            <Upload />
        </>
    );
}

export default App;
