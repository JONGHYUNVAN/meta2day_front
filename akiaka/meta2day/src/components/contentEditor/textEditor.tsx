'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Button, Tooltip, Select } from 'antd';
import { BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    UploadOutlined,
    FontColorsOutlined,
    LinkOutlined,
    BgColorsOutlined,
    BlockOutlined } from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import ImageResize from 'tiptap-extension-resize-image';
import FileUploader, { FileUploadRef } from "@/components/fileUploader/fileUploader";
import FontSize from './fontSize'
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import BackgroundColor from "@/components/contentEditor/backGroundColor";

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
    const textColors = [
        '#4d4d4d','#333333', '#1a1a1a',  '#000000',
        '#ef4444', '#d13d3d', '#b43737', '#963030',
        '#eab308', '#d1a20c', '#b78f10', '#9e7c14',
        '#10b981', '#0ea374', '#0c8c67', '#0a7659',
        '#3b82f6', '#356ede', '#305bc6', '#2b49ae',
        '#8b5cf6', '#7e51dd', '#7045c3', '#6239aa'
    ];
    const paintColors = ['#000000','#eab308', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];
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
            }),
            ImageResize.configure({
                inline: true,
            }),
            FontSize,
            Color.configure({ types: ['textStyle'] }),
            Link.configure({ openOnClick: false }),
            BackgroundColor,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const fileUploaderRef = useRef<FileUploadRef | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleImageUpload = useCallback(async () => {
        if (fileUploaderRef.current) {
            const uploadedUrl = await fileUploaderRef.current.uploadFileToS3();
            if (uploadedUrl) {
                setUploadedImages((prevImages) => [...prevImages, `process.env.NEXT_PUBLIC_CLOUDFRONT_URL/${uploadedUrl}`]);
            }
        }
    }, []);

    const handleImageInsert = useCallback((imageUrl: string) => {
        if (editor) {
            const html = `
            <img src="${imageUrl}" style="width: 200px; height: auto;" />
        `;
            editor.chain().focus().insertContent(html).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="editor">
            <div className="menu-bar" style={{marginBottom: '16px'}}>
                <Tooltip title="Bold" className="mr-1">
                    <Button
                        icon={<BoldOutlined/>}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        type={editor.isActive('bold') ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Italic" className="mr-1">
                    <Button
                        icon={<ItalicOutlined/>}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        type={editor.isActive('italic') ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Underline" className="mr-1">
                    <Button
                        icon={<UnderlineOutlined/>}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        type={editor.isActive('underline') ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Select
                    className="mr-2 text-center"
                    defaultValue="Nanum Gothic"
                    style={{width: 150}}
                    onChange={(value) => editor.chain().focus().setFontFamily(value).run()}
                >
                    <Select.Option value="Nanum Gothic" className="Nanum-Gothic">나눔 고딕</Select.Option>
                    <Select.Option value="Nanum Myeongjo" className="Nanum-Myeongjo">나눔 명조</Select.Option>
                    <Select.Option value="Nanum Pen Script" className="Nanum-Pen-Script">나눔 펜 글씨</Select.Option>
                    <Select.Option value="Noto Sans KR" className="Noto-Sans-KR">본고딕</Select.Option>
                    <Select.Option value="Do Hyeon" className="Do-Hyeon">도현체</Select.Option>
                    <Select.Option value="Gothic A1" className="Gothic-A1">Gothic A1</Select.Option>
                    <Select.Option value="Roboto" className="Roboto">Roboto</Select.Option>
                    <Select.Option value="Open Sans" className="Open-Sans">Open Sans</Select.Option>
                    <Select.Option value="Lato" className="Lato">Lato</Select.Option>
                    <Select.Option value="Dancing Script" className="Dancing-Script">Dancing Script</Select.Option>
                    <Select.Option value="Pacifico" className="Pacifico">Pacifico</Select.Option>
                </Select>

                <Select
                    defaultValue="15px"
                    className="mr-2 text-center"
                    style={{width: 100}}
                    // @ts-ignore
                    onChange={(value) => editor.chain().focus().setFontSize(value).run()}
                >
                    <Select.Option value="10px">10px</Select.Option>
                    <Select.Option value="15px">15px</Select.Option>
                    <Select.Option value="20px">20px</Select.Option>
                    <Select.Option value="25px">25px</Select.Option>
                    <Select.Option value="30px">30px</Select.Option>
                    <Select.Option value="40px">40px</Select.Option>
                    <Select.Option value="50px">50px</Select.Option>
                </Select>
                <Tooltip title="Align Left" className="mr-1">
                    <Button
                        icon={<AlignLeftOutlined/>}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        type={editor.isActive({textAlign: 'left'}) ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Align Center" className="mr-1">
                    <Button
                        icon={<AlignCenterOutlined/>}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        type={editor.isActive({textAlign: 'center'}) ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip title="Align Right" className="mr-2">
                    <Button
                        icon={<AlignRightOutlined/>}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        type={editor.isActive({textAlign: 'right'}) ? 'primary' : 'default'}
                    />
                </Tooltip>
                <Tooltip className="mr-2"/>
                {paintColors.map((color) => (
                    <Tooltip title="Background Color" key={color} className="mr-1">
                        <Button
                            icon={<BgColorsOutlined style={{color: color}}/>}
                            //@ts-ignore
                            onClick={() => editor.chain().focus().setBackgroundColor(color).run()}
                            type={editor.isActive('textStyle', {backgroundColor: color}) ? 'primary' : 'default'}
                        />
                    </Tooltip>
                ))}
                <Tooltip className="mr-2"/>
                <Tooltip title="Add Link" className="mr-1">
                    <Button
                        icon={<LinkOutlined/>}
                        onClick={() => {
                            const url = prompt('Enter the URL');
                            if (url) {
                                editor.chain().focus().setLink({href: url}).run();
                            }
                        }}
                        type={editor.isActive('link') ? 'primary' : 'default'}
                    />
                </Tooltip>
                <div className="mt-1 mt-2"></div>
                {textColors.map((color) => (
                    <Tooltip title="Text Color" key={color} className="mr-1">
                        <Button
                            icon={<FontColorsOutlined style={{color: color}}/>}
                            onClick={() => editor.chain().focus().setColor(color).run()}
                            type={editor.isActive('textStyle', {color: color}) ? 'primary' : 'default'}
                        />
                    </Tooltip>
                ))}
                <div className="mt-1"></div>
                <label htmlFor="content" className="text-gray-400 text-xl">이미지 업로드 / 추가</label>
                <div className="file-upload-section bg-gray-400 flex items-center space-x-4">
                    <div className="flex-grow bg-white">
                        <FileUploader ref={fileUploaderRef} setFileUrl={() => {
                        }}/>
                    </div>
                    <Button onClick={handleImageUpload} className="ml-auto" icon={<UploadOutlined/>}>
                        Upload Image
                    </Button>
                </div>

                <div className="mt-1"></div>
                <label htmlFor="content" className="text-gray-400 text-xl">업로드된 이미지 (클릭시 본문 추가)</label>
                <div className="uploaded-images h-24 flex space-x-4 bg-white">
                    {uploadedImages.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Uploaded ${index}`}
                            className="w-24 cursor-pointer"
                            onClick={() => handleImageInsert(imageUrl)}
                        />
                    ))}
                </div>

            </div>
            <label htmlFor="content" className="text-gray-400 text-xl">본문 입력</label>
            <div
                className="bg-white min-h-[50vh]"
                onClick={() => editor?.commands.focus()}
            >
                <EditorContent
                    editor={editor}
                />
            </div>


        </div>
    );
};

export default TextEditor;
