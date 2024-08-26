import { Extension } from '@tiptap/core';

const BackgroundColor = Extension.create({
    name: 'backgroundColor',

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
                    backgroundColor: {
                        default: null,
                        parseHTML: element => element.style.backgroundColor,
                        renderHTML: attributes => {
                            if (!attributes.backgroundColor) {
                                return {};
                            }
                            return {
                                style: `background-color: ${attributes.backgroundColor}`,
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
            // @ts-ignore
            setBackgroundColor: backgroundColor => ({ chain }) => {
                return chain().setMark('textStyle', { backgroundColor }).run();
            },
            // @ts-ignore
            unsetBackgroundColor: () => ({ chain }) => {
                return chain().setMark('textStyle', { backgroundColor: null }).run();
            },
        };
    },
});

export default BackgroundColor;
