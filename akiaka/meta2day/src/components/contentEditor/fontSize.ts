import { Extension, Command } from '@tiptap/core';

const FontSize = Extension.create({
    name: 'fontSize',

    addOptions() {
        return {
            types: ['textStyle'],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize,
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }

                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    // @ts-ignore
    addCommands() {
        return {
            setFontSize:
                (fontSize: string): Command =>
                    ({ chain }) => {
                        return chain().setMark('textStyle', { fontSize }).run();
                    },
            unsetFontSize:
                (): Command =>
                    ({ chain }) => {
                        return chain().setMark('textStyle', { fontSize: null }).run();
                    },
        };
    },
});

export default FontSize;
