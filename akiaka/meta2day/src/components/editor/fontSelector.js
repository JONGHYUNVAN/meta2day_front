import { fontList } from './fonts';

const FontSelector = () => {
    return (
        <div id="toolbar">
            <select className="ql-font custom-font-select">
                {fontList.map((font) => (
                    <option key={font.className} value={font.className}>{font.name}</option>
                ))}
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

export default FontSelector;