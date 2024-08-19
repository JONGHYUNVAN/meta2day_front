'use client'
import React, { useCallback } from 'react';
import { Button, Tooltip, Select, Upload } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, PictureOutlined } from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import ImageResize from 'tiptap-extension-resize-image';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            ImageResize.configure(
                {
                    inline: true,
                    allowBase64: true,
                }
            )
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });


    const handleImageUpload = useCallback((file:File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;

            if (editor) {
                editor.chain().focus().setImage({ src: base64 }).run();
            }
        };
        reader.readAsDataURL(file);
        return false;
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="editor">
            <div className="menu-bar" style={{ marginBottom: '16px' }}>
                <Tooltip title="Bold">
                    <Button
                        icon={<BoldOutlined />}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        type={editor.isActive('bold') ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Italic">
                    <Button
                        icon={<ItalicOutlined />}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        type={editor.isActive('italic') ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Underline">
                    <Button
                        icon={<UnderlineOutlined />}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        type={editor.isActive('underline') ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Select
                    defaultValue="Nanum Gothic"
                    style={{ width: 150 }}
                    onChange={(value) => editor.chain().focus().setFontFamily(value).run()}
                >
                    <Select.Option value="Nanum Gothic" className="Nanum-Gothic">Nanum Gothic</Select.Option>
                    <Select.Option value="Nanum Myeongjo" className="Nanum-Myeongjo">Nanum Myeongjo</Select.Option>
                    <Select.Option value="Nanum Pen Script" className="Nanum-Pen-Script">Nanum Pen Script</Select.Option>
                    <Select.Option value="Noto Sans KR" className="Noto-Sans-KR">Noto Sans KR</Select.Option>
                    <Select.Option value="Do Hyeon" className="Do-Hyeon">Do Hyeon</Select.Option>
                </Select>
                <Tooltip title="Align Left">
                    <Button
                        icon={<AlignLeftOutlined />}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Align Center">
                    <Button
                        icon={<AlignCenterOutlined />}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Align Right">
                    <Button
                        icon={<AlignRightOutlined />}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Insert Image">
                    <Upload
                        showUploadList={false}
                        beforeUpload={handleImageUpload}
                    >
                        <Button icon={<PictureOutlined />}>Insert Image</Button>
                    </Upload>
                </Tooltip>
            </div>
            <EditorContent className="bg-white min-h-[50vh]" editor={editor} />
        </div>
    );
};

export default TextEditor;
