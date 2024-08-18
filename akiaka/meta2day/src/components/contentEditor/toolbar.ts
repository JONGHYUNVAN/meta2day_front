'use client';

import {useEffect, useMemo, useState} from 'react';
import Quill from 'quill';
import ImageResize from 'quill-resize-image';
import 'react-quill/dist/quill.snow.css';

function Toolbar() {
    useEffect(() => {
        Quill.register('modules/imageResize', ImageResize);
    }, []);

    return useMemo(() => ({
        toolbar: {
            container: '#toolbar',
        },
        imageResize: {}
    }), []);
}
export default Toolbar