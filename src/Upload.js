import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import { css } from '@emotion/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { IconButton } from '@material-ui/core';
import AnimatedModal from './userTrain';
import Dropzone from 'react-dropzone';
import Banner from 'react-js-banner';
import PropagateLoader from 'react-spinners/PropagateLoader';
import './Upload.scss';
import InfoModal from './InfoModal';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Upload() {
    const [state, SetState] = useState({
        error: false,
        fail: false,
        predictions: '',
        loading: false,
        fileName: '',
        hash: '',
        vote: [],
        showResult: false,
        bannerStatus: false,
        reload: false
    });

    const clear = () => {
        SetState({
            ...state,
            error: false,
            fail: false,
            predictions: '',
            loading: false,
            fileName: '',
            hash: '',
            vote: [],
            showResult: false,
            bannerStatus: false,
            reload: true,
            house: undefined
        });
    };

    const showBanner = status => {
        SetState(status); // 지정한 status로 state를 변경하여 Banner를 표시.
        setTimeout(function() {
            // 3초 후 state를 원상복귀 함으로써 3초 동안만 Banner를 표시해 주는것.
            SetState({ bannerStatus: false, error: false, fail: false });
        }, 3000);
    };

    // https://blog.shovonhasan.com/using-promises-with-filereader/
    // 비동기적으로 처리되는 파일 읽기 작업은 마찬가지로 비동기적으로 처리되는 axios보다 먼저 수행될 필요가 있다.
    // 파일 읽기가 axios보다 선행되지 않은 경우 그림 파일을 캔버스에 렌더링하지 못하는 문제가 있었던 것.
    // Promise로 FileReader를 감싸줌으로써 이를 해결.
    const readFileAsync = (inputFile) =>{
        // FileReader -> 비동기적으로 데이터 read. File 또는 Blob 객체를 이용해 파일을 읽고 저장.
        const reader = new FileReader();

        return new Promise((resolve, reject) =>{
            reader.onerror = () =>{
                reader.abort();
                reject(new DOMException("Problem parsing input file."));
            }

            reader.onload = () =>{  // read File에 성공했을 때,
                const output = document.getElementById('preview');
                output.src = reader.result;
                console.log("%conLoad.output = ", 'color:green', output);
                console.log(document.getElementById("imageCanvas"));
                resolve(reader.result);
            }
            reader.readAsDataURL(inputFile[0]); // read file
        })
    }
    
    const onDrop = async event => {
        console.log('UPLOAD.js -> onDrop -> event = ', event);
        // Dropzone에 파일을 올리면, loading = T 상태로 변경.
        SetState({
            ...state,
            predictions: '',
            loading: true,
            fileName: '',
            hash: '',
            vote: [],
            showResult: false
        });
        const pictureFiles = event;
        const content = await readFileAsync(pictureFiles);
        const canvas = document.getElementById('imageCanvas'); // canvas를 가져와 그릴 준비
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (pictureFiles.length > 0) {
            const formData = new FormData(); // 서버에 text가 아닌 file을 보낼 때 FormData()를 사용
            formData.append('image', pictureFiles[0], pictureFiles[0].name);
            console.log("FORMDATA === ", formData);

            const start = new Date().getTime();
            let imagePost = async () => {   // Node.js 서버로 사진 보내기
                try {
                    console.log('ASYNC');
                    console.log(formData);
                    return await axios.post(
                        'https://theraphy-nodejs-heroku2.herokuapp.com/',
                        //'http://localhost:3001/',
                        //'https://st4flx8u1l.execute-api.ap-northeast-2.amazonaws.com/production', // AWS Lambda
                        formData
                    );
                } catch (error) {
                    console.log(error);
                }
            };
            let response = await imagePost(); // 서버 응답받기

            const elapsed = new Date().getTime() - start;
            console.log("%c소요된 시간 == ",'color:green', elapsed);
            console.log('AWAIT');
            console.log('response = ', response);
            console.log('response.data = ', response.data);
            if (!response) {
                // 에러가 있으면,
                console.log('IN1');
                showBanner({ error: true });
            } else {
                const img = document.getElementById('preview');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                if(response.data.success !== false){
                    // 에러가 없으면, 캔버스에 그리기
                    if (response.data[0][0].success === true) {
                        // console.log('rseponse.data[0] = ', response.data[0]);
                        // console.log('response.data[0][0] = ', response.data[0][0]);
                        // console.log('response.data[1][0] = ', response.data[1][0]);
                        for(let i=0; i<response.data.length; i++){
                            console.log(response.data[i][0]);
                            let caption = (text => {
                                return { 'house': '집', 'window': '창문', 'door': '현관문', 'roof' : '지붕', 'triangle roof': '뾰족한 지붕', 'fense': '울타리', 'smoking chimney': '연기나는 굴뚝' }[text];
                            })(response.data[i][0].label);
                            const { x, y, width, height } = response.data[i][0].coordinate;
                            let color = getRandomColor();
                            console.log(response.data[0][0].house);
                            
                            // stroke()는 이전에 그렸던 path를 다음번에도 그리는 습성이 있는데, beginPath()로 초기화. 색상 지정을 위함.
                            ctx.beginPath();    
                            ctx.lineWidth = "3";
                            ctx.font="bold 40px sans-serif";
                            ctx.fillStyle= color;   
                            ctx.strokeStyle = color;
                            ctx.fillText(caption + " " + response.data[i][0].score.toFixed(3), x, y+40);
                            ctx.rect(x, y, width, height);
                            ctx.stroke();

                            if(i===0){
                                SetState({
                                    ...state,
                                    predictions: caption,
                                    loading: false,
                                    fileName: response.data[0][0].path,
                                    hash: response.data[0][0].hash,
                                    vote: [
                                        response.data[0].voteChaewon,
                                        response.data[0].voteYuri,
                                        response.data[0].voteYena
                                    ],
                                    showResult: true,
                                    house: response.data[0][0].house
                                })
                            }else{
                                SetState({
                                    ...state,
                                    predictions: caption,
                                    loading: false,
                                    showResult: true,
                                    house: response.data[0][0].house
                                })
                            }
                            console.log("%cSTATE(ONDROP) == ",'color:blue', state);
                        };
                    }
                } else {
                    console.log('IN2');
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    SetState({
                        ...state,
                        predictions: 'fail to find',
                        loading: false,
                        fileName: response.data.path,
                        hash: response.data.hash
                    });
                    showBanner({ fail: true });
                }
            }
        }
    };

    useEffect(() => {
        const paste = event => {
            clear();
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            console.log(JSON.stringify(items));
            var blob = null;
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') === 0) {
                    blob = items[i].getAsFile();
                }
            }
            if (blob !== null) {
                console.log(blob);
                onDrop([blob]);
            }
        };
        window.addEventListener('paste', paste);
    });

    return (
        <div className="back">
            <Banner
                className="banner"
                title="응답이 제출되었습니다."
                showBanner={state.bannerStatus}
            />
            <Banner
                css={{ backgroundColor: 'red', color: 'white' }}
                className="banner"
                title="잘못된 파일이거나, 서버가 응답할 수 없습니다."
                showBanner={state.error}
            />
            <Banner
                css={{ backgroundColor: 'yellow' }}
                className="banner"
                title="얼굴을 찾을 수 없습니다."
                showBanner={state.fail}
            />
            <div className="bodyDiv">
                <InfoModal></InfoModal>
                <img className="preview" id="preview" alt="프리뷰" />
                <div className="upload">
                    <IconButton className="iconButton" onClick={clear} size="small">
                        <RefreshIcon className="refresh" fontSize="large" />
                    </IconButton>
                    <div className="upload-files">
                        <header>
                            <p>
                                <span className="up">HTP</span>
                                <span className="load">검사</span>
                            </p>
                        </header>
                        <div className="body">
                            {!state.loading && !state.showResult ? ( 
                                // loading=F , showResult=F
                                // 로딩중도 아니고 결과를 보여줘야 하는 상황도 아니라면, 파일 업로드를 위한 Dropzone UI 출력
                                <div className="uploadBox">
                                    <Dropzone
                                        multiple={false}
                                        onDrop={acceptedFiles => onDrop(acceptedFiles)}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <section className="dropSection">
                                                {/* <div className="dropBox" {...getRootProps(this.style)}> */}
                                                <div className="dropBox" {...getRootProps()}>
                                                    <input
                                                        className="dropzone"
                                                        {...getInputProps({
                                                            type: 'file',
                                                            accept: 'image/*'
                                                        })}
                                                    />
                                                    <div className="dropText">
                                                        <p
                                                            className={
                                                                state.reload ? 'nomalP' : 'fadeP'
                                                            }
                                                        >
                                                            업로드할 파일을 드래그하거나
                                                        </p>
                                                        <p
                                                            className={
                                                                state.reload ? 'nomalP' : 'fadeP'
                                                            }
                                                        >
                                                            박스를{' '}
                                                            <span style={{ color: 'lightBlue' }}>
                                                                {' '}
                                                                클릭
                                                            </span>
                                                            해주세요
                                                        </p>
                                                        <br />
                                                        <p
                                                            className={
                                                                state.reload ? 'nomalP' : 'fadeP'
                                                            }
                                                        >
                                                            <span style={{ color: 'lightBlue' }}>
                                                                Ctrl+V
                                                            </span>
                                                            로 클립보드에 있는 이미지를
                                                        </p>
                                                        <p
                                                            className={
                                                                state.reload ? 'nomalP' : 'fadeP'
                                                            }
                                                        >
                                                            붙여 넣을 수 있습니다.
                                                        </p>
                                                    </div>
                                                </div>
                                            </section>
                                        )}
                                    </Dropzone>
                                </div>
                            ) : (
                                // 1. Loading이 T이고 showResult가 F일 때, 2. Loading이 F이고 showResult가 T일 때 모두 진입
                                <div className="imageBox">
                                    <div className="imageTable">
                                        <canvas className="imageCanvas" id="imageCanvas">
                                            이 브라우저는 'canvas'기능을 제공하지 않습니다.
                                        </canvas>
                                        {state.showResult ? ( //  showResult가 T인 경우, 결과 출력
                                            // <div className="resultBox">
                                            //     <div className="resultDiv">
                                            //         {/* 분석 결과 : {state.predictions} */}
                                            //     </div>
                                            //     <div className="resultDiv">
                                            //         <AnimatedModal
                                            //             banner={showBanner}
                                            //             clear={clear}
                                            //             fileName={state.fileName}
                                            //             hash={state.hash}
                                            //             prediction={state.predictions}
                                            //         />
                                            //     </div>
                                            // </div>
                                            <>
                                            </>
                                        ) : null}
                                        {/* 로딩중 이미지 출력 */}
                                        <div className="loadingBox">
                                            <PropagateLoader
                                                css={override}
                                                size={25}
                                                color={'#FF509F'}
                                                loading={state.loading}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* {console.log("!STATE.LOADING = ", !state.loading)} */}
                {/* {console.log("!STATE.SHOWRESULT = ", !state.showResult)} */}
                {/* {console.log("&& = ", !state.loading && !state.showResult)} */}
                {console.log("STATE.HOUSE =",state.house)}
                {console.log("%cSTATE(RENDER) == ",'color:red', state)}
                
                {/* loading=F, showResult=F, house =F인 경우에만 조건문이 T가 되어 null을 출력 
                그 외의 경우 = Loading=T, showResult=F, house=F인 경우나,
                Loading=F, showResult=T, house=T인 경우에 조건문이 F가 되어서 테이블을 출력. */}
                {!state.loading && !state.showResult && !state.house ? null : (
                    <Table house={state.house}></Table>
                )}
            </div>
        </div>
    );
}

export default Upload;
