'use client';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import FontSelector from './fontSelector';
import Toolbar from "./toolbar";
import formats from "./formats";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Editor = ({ value, onChange }) => {
    const modules = Toolbar();

    return (
        <div className="editor-container p-4 border rounded-lg shadow-lg bg-white h-[80vh] flex flex-col">
            <FontSelector />
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={value}
                onChange={onChange}
                className="h-full flex-grow"
            />
        </div>
    );
};

export default Editor;