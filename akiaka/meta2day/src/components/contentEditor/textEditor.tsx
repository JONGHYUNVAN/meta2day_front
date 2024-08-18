'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import formats from "./formats";
import TextEditorToolbar from "@/components/contentEditor/TextEditorToolbar";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface TextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
    const modules = {
        toolbar: {
            container: "#toolbar",
        },
    };

    return (
        <div className="editor-container p-4 border rounded-lg shadow-lg bg-white h-[80vh] flex flex-col">
            <TextEditorToolbar />
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

export default TextEditor;
