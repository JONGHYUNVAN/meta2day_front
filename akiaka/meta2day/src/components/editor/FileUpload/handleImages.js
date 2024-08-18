import {uploadBase64Image} from "./uploadBase64Image";

export const handleDescriptionImages = async (description, title) => {
    const base64Images = description.match(/<img[^>]+src="data:image\/[a-zA-Z]+;base64,[^"]+"[^>]*>/g) || [];
    const uploadPromises = base64Images.map(async (base64Image, index) => {
        const base64String = base64Image.match(/src="([^"]+)"/)[1];
        const mimeType = base64String.match(/data:([^;]+);/)[1];
        const extension = mimeType.split('/')[1]; // MIME 타입에서 확장자 추출
        const fileName = `${title.replace(/\s+/g, '_')}_${index + 1}.${extension}`; // 파일명을 올바른 확장자로 생성
        return await uploadBase64Image(base64String, fileName);
    });

    const uploadedImageKeys = await Promise.all(uploadPromises);

    let updatedDescription = description;
    base64Images.forEach((base64Image, index) => {
        const base64String = base64Image.match(/src="([^"]+)"/)[1];
        const imageUrl = `${uploadedImageKeys[index]}`;
        const updatedImageTag = base64Image.replace(base64String, imageUrl);
        updatedDescription = updatedDescription.replace(base64Image, updatedImageTag);
    });

    return updatedDescription;
};