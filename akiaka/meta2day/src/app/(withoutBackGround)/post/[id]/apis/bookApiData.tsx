'use client';

import React, { useEffect, useState } from 'react';

interface BookApiDataProps {
    bookTitle: string;
    authorName: string;
}

const BookApiData: React.FC<BookApiDataProps> = ({ bookTitle, authorName }) => {
    const [bookData, setBookData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchBookApiData = async (bookTitle: string, authorName: string) => {
        const searchQuery = `${encodeURIComponent(bookTitle)}+inauthor:${encodeURIComponent(authorName)}`;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=1&key=${process.env.NEXT_PUBLIC_BOOK_API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            if (data.items && data.items.length > 0) {
                setBookData(data.items[0].volumeInfo);
            } else {
                setErrorMessage('책 데이터를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('Failed to fetch book data:', error);
            setErrorMessage('책 데이터를 가져오는 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    useEffect(() => {
        if (bookTitle && authorName) {
            fetchBookApiData(bookTitle, authorName);
        }
    }, [bookTitle, authorName]);

    if (errorMessage) {
        return <div className="text-red-500">{errorMessage}</div>;
    }

    if (!bookData) {
        return <div className="neon-text flex justify-center items-center">Fetching Book data... Now Loading</div>;
    }

    return (
        <div className="ml-[10vw] flex flex-col justify-center items-center space-y-[5vh]">
            <h2 className="text-xl font-bold">{bookData.title}</h2>
            <ul className="list-none space-y-[5vh]">
                {bookData.authors && <li>저자 : {bookData.authors.join(', ')}</li>}
                {bookData.publisher && <li>출판사 : {bookData.publisher}</li>}
                {bookData.publishedDate && <li>출판일 : {new Date(bookData.publishedDate).toLocaleDateString()}</li>}
                {bookData.categories && <li>카테고리 : {bookData.categories.join(', ')}</li>}
            </ul>
        </div>
    );
};

export default BookApiData;
