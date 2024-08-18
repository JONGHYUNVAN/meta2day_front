'use client';
import dynamic from 'next/dynamic';
import {useEffect, useMemo, useState} from 'react';
import Quill from 'quill';
import ImageResize from 'quill-image-resize';
import 'react-quill/dist/quill.snow.css';
import FontSelector from './fontSelector';


function Toolbar() {
    useEffect(() => {
        Quill.register('modules/imageResize', ImageResize);
    }, []);

    return useMemo(() => ({
        toolbar: {
            container: '#toolbar',
            handlers: {
                image: function () {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();

                    input.onchange = () => {
                        const file = input.files[0];
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const range = this.quill.getSelection();
                            this.quill.insertEmbed(range.index, 'image', e.target.result);
                        };
                        reader.readAsDataURL(file);
                    };
                }
            }
        },
        imageResize: {}
    }), []);
}
export default Toolbar

