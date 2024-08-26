'use client';

import React, { useEffect, useState } from 'react';

interface MusicApiDataProps {
    albumTitle: string;
    artistName: string;
}

const MusicApiData: React.FC<MusicApiDataProps> = ({ albumTitle, artistName }) => {
    const [musicData, setMusicData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchMusicApiData = async (albumTitle: string, artistName: string) => {
        const searchQuery = `${encodeURIComponent(albumTitle)} ${encodeURIComponent(artistName)}`;
        const url = `https://itunes.apple.com/search?term=${searchQuery}&media=music&entity=album&limit=1`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.results.length > 0) {
                setMusicData(data.results[0]); // 첫 번째 결과 사용
            } else {
                setErrorMessage('음악 데이터를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('Failed to fetch music data:', error);
            setErrorMessage('음악 데이터를 가져오는 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    useEffect(() => {
        if (albumTitle && artistName) {
            fetchMusicApiData(albumTitle, artistName);
        }
    }, [albumTitle, artistName]);

    if (errorMessage) {
        return <div className="text-red-500">{errorMessage}</div>;
    }

    if (!musicData) {
        return <div className="neon-text flex justify-center items-center">Fetching Music data... Now Loading</div>;
    }

    return (
        <div className="ml-[10vw] flex flex-col justify-center items-center space-y-[5vh]">
            <h2 className="text-xl font-bold">{musicData.collectionName}</h2>
            <ul className="list-none space-y-[5vh]">
                {musicData.artistName && <li>아티스트 : {musicData.artistName}</li>}
                {musicData.collectionName && <li>앨범 : {musicData.collectionName}</li>}
                {musicData.releaseDate && <li>발매일 : {new Date(musicData.releaseDate).toLocaleDateString()}</li>}
                {musicData.primaryGenreName && <li>장르 : {musicData.primaryGenreName}</li>}
            </ul>
        </div>
    );
};

export default MusicApiData;
