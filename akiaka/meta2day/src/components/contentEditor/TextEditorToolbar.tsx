'use client';

import React from 'react';

const TextEditorToolbar: React.FC = () => {
    return (
        <div className="custom-toolbar">
            <select className="ql-font custom-font-select">
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="Noto-Sans-KR">Noto Sans KR</option>
                <option value="Nanum-Gothic">나눔 고딕</option>
                <option value="Nanum-Myeongjo">나눔 명조</option>
                <option value="Nanum-Pen-Script">나눔 펜 글씨</option>
                <option value="Do-Hyeon">도 현</option>
            </select>
            <select className="ql-size" defaultValue="normal">
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="huge">Huge</option>
            </select>
            <button className="ql-align" value=""></button>
            <button className="ql-align" value="center"></button>
            <button className="ql-align" value="right"></button>
            <button className="ql-align" value="justify"></button>
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
            <button className="ql-color"></button>
            <button className="ql-background"></button>
            <button className="ql-image"></button>
        </div>
    );
};

export default TextEditorToolbar;
