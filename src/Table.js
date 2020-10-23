import React from 'react';
import './Table.scss';

function PrintTableRow({ array }) {
    return (
        <tr>
            <td>{array.no}</td>
            <td>{array.division}</td>
            <td>{array.item}</td>
            <td>{array.first}</td>
            <td>{array.second}</td>
            <td>{array.third}</td>
            <td>{array.fourth}</td>
            <td>{array.fifth}</td>
            <td>{array.sixth}</td>
            <td>{array.seventh}</td>
            <td>{array.eighth}</td>
            <td>{array.ninth}</td>
        </tr>
    );
}

function Table({ house }) {
    // 논문에 제시된 채점표 항목
    const HList = [
        {
            no: 0,
            division: '가',
            item: '가',
            first: '가',
            second: '가',
            third: '가',
            fourth: '가',
            fifth: '가',
            sixth: '가',
            seventh: '가',
            eighth: '가',
            ninth: '가'
        },
        {
            no: 4,
            division: '크기',
            item: '지나치게 큰 집',
            first: 1,
            second: 1,
            third: 0,
            fourth: 0,
            fifth: 0,
            sixth: 0,
            seventh: 0,
            eighth: 0,
            ninth: 0
        },
        {
            no: 5,
            division: '크기',
            item: '지나치게 작은집',
            first: 0,
            second: 0,
            third: 1,
            fourth: 0,
            fifth: 1,
            sixth: 1,
            seventh: 0,
            eighth: 1,
            ninth: 1
        },
        {
            no: 7,
            division: '위치',
            item: '좌측에 위치한 집',
            first: 0,
            second: 0,
            third: 0,
            fourth: 0,
            fifth: 1,
            sixth: 0,
            seventh: 1,
            eighth: 0,
            ninth: 0
        },
        {
            no: 8,
            division: '위치',
            item: '우측에 위치한 집',
            first: 1,
            second: 0,
            third: 0,
            fourth: 0,
            fifth: 0,
            sixth: 0,
            seventh: 0,
            eighth: 0,
            ninth: 0
        },
        {
            no: 9,
            division: '위치',
            item: '하단에 위치한 집',
            first: 0,
            second: 0,
            third: 1,
            fourth: 0,
            fifth: 1,
            sixth: 1,
            seventh: 0,
            eighth: 1,
            ninth: 0
        },
        {
            no: 12,
            division: '지붕',
            item: '과도하게 큰 지붕',
            first: 1,
            second: 0,
            third: 0,
            fourth: 0,
            fifth: 0,
            sixth: 1,
            seventh: 1,
            eighth: 0,
            ninth: 1
        },
        {
            no: 18,
            division: '현관문',
            item: '현관문이 과하게 클 경우',
            first: 0,
            second: 0,
            third: 0,
            fourth: 0,
            fifth: 1,
            sixth: 0,
            seventh: 1,
            eighth: 0,
            ninth: 0
        },
        {
            no: 19,
            division: '현관문',
            item: '현관문이 과하게 작을 경우',
            first: 0,
            second: 0,
            third: 1,
            fourth: 0,
            fifth: 1,
            sixth: 1,
            seventh: 1,
            eighth: 0,
            ninth: 0
        },
        {
            no: 22,
            division: '현관문',
            item: '현관문의 생략',
            first: 0,
            second: 1,
            third: 1,
            fourth: 1,
            fifth: 1,
            sixth: 1,
            seventh: 1,
            eighth: 1,
            ninth: 0
        },
        {
            no: 23,
            division: '창문',
            item: '창문의 생략',
            first: 0,
            second: 0,
            third: 0,
            fourth: 1,
            fifth: 1,
            sixth: 0,
            seventh: 0,
            eighth: 1,
            ninth: 1
        },
        {
            no: 24,
            division: '창문',
            item: '3개 이상의 많은 창문',
            first: 0,
            second: 1,
            third: 0,
            fourth: 0,
            fifth: 0,
            sixth: 0,
            seventh: 0,
            eighth: 1,
            ninth: 0
        },
        {
            no: 27,
            division: '굴뚝',
            item: '굴뚝의 연기',
            first: 0,
            second: 0,
            third: 1,
            fourth: 0,
            fifth: 1,
            sixth: 0,
            seventh: 0,
            eighth: 0,
            ninth: 0
        },
        {
            no: 31,
            division: '기타',
            item: '울타리의 표현',
            first: 0,
            second: 1,
            third: 0,
            fourth: 1,
            fifth: 1,
            sixth: 1,
            seventh: 0,
            eighth: 1,
            ninth: 0
        }
    ];

    // 입력한 그림이 채점표(HList)중에서 해당되는 부분(pertinentList)만을 찾는다.
    let pertinentList = [];
    house.forEach(ab => {
        pertinentList.push(HList.find(abc => abc.no === ab));
    });

    return (
        // https://codepen.io/alexerlandsson/pen/mPWgpO
        <div className="tableContainer">
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>구분</th>
                        <th>항목</th>
                        <th>공격성</th>
                        <th>사회불안</th>
                        <th>우울</th>
                        <th>대인회피</th>
                        <th>자존감</th>
                        <th>정서불안</th>
                        <th>애정결핍</th>
                        <th>열등감</th>
                        <th>퇴행</th>
                    </tr>
                </thead>
                <tbody>
                    {/* https://flaviocopes.com/react-how-to-loop/ */}
                    {pertinentList ? (
                        pertinentList.map(abc => {
                            return <PrintTableRow array={abc} key={abc.no} />;
                        })
                    ) : (
                        <td>nothing</td>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>3</td>
                        <td>5</td>
                        <td>3</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                        <td>5</td>
                        <td>1</td>
                        <td>2</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

Table.defaultProps = {
    house: [0]
};

export default Table;
