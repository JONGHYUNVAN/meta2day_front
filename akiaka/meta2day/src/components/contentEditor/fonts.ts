'use client'
import Quill from 'quill';

export const fontList = [
    { name: 'Noto Sans KR', className: 'Noto-Sans-KR' },
    { name: 'Nanum Gothic', className: 'Nanum-Gothic' },
    { name: 'Nanum Myeongjo', className: 'Nanum-Myeongjo' },
    { name: 'Nanum Pen Script', className: 'Nanum-Pen-Script' },
    { name: 'Do Hyeon', className: 'Do-Hyeon' }
];

const fonts = fontList.map(font => font.className);

const Font = Quill.import('formats/font') as any;
Font.whitelist = fonts;
Quill.register(Font, true);

export default fonts;