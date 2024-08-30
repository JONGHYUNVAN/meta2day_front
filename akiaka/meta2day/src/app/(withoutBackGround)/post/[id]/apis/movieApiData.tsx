'use client';

import React, { useEffect, useState } from 'react';

interface MovieApiDataProps {
    movieTitle: string;
}

const MovieApiData: React.FC<MovieApiDataProps> = ({ movieTitle }) => {
    const [movieData, setMovieData] = useState<any>(null);

    const fetchMovieApiData = async (movieTitle: string) => {
        const apiKey = process.env.NEXT_PUBLIC_MOVIE_API_KEY;
        const url = `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${apiKey}&movieNm=${encodeURIComponent(movieTitle)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.log(`HTTP error! status: ${response.status}`);
                return;
            }

            const data = await response.json();
            const movieList = data.movieListResult.movieList;

            const matchingMovie = movieList.find((movie: any) => movie.movieNm === movieTitle);

            if (matchingMovie) {
                setMovieData(matchingMovie);
            } else {
                setMovieData(movieList[0]);
            }
        } catch (error) {
            console.error('Failed to fetch movie data:', error);
        }
    };

    useEffect(() => {
        if (movieTitle) {
            fetchMovieApiData(movieTitle);
        }
    }, [movieTitle]);

    if (!movieData) {
        return <div className="neon-text flex justify-center items-center">Fetching Movie data... Now Loading</div>;
    }

    return (
        <div className="flex justify-center items-center">
            {movieData && (
                <ul className={`ml-8 ${movieData.actors && movieData.actors.length > 0 ? 'space-y-[2vh]' : 'space-y-[5vh]'} text-left`}>
                    {movieData.movieNm && <li>영화 제목: <span className="Do-Hyeon ml-32">{movieData.movieNm}</span></li>}
                    {movieData.movieNmEn && <li>영문 제목: <span className="Do-Hyeon ml-32">{movieData.movieNmEn}</span></li>}
                    {movieData.prdtYear && <li>제작 연도: <span className="Do-Hyeon ml-32">{movieData.prdtYear}</span></li>}
                    {movieData.openDt && <li>개봉 연도: <span className="Do-Hyeon ml-32">{movieData.openDt}</span></li>}
                    {movieData.genreNm && <li>장르: <span className="Do-Hyeon ml-32">{movieData.genreNm}</span></li>}
                    {movieData.showTm && <li>상영 시간: <span className="Do-Hyeon ml-32">{movieData.showTm} 분</span></li>}
                    {movieData.actors && movieData.actors.length > 0 && (
                        <li>
                            출연진:
                            <ul className="ml-40 space-y-2">
                                {movieData.actors.slice(0, 5).map((actor: any, index: number) => (
                                    <li key={index} className="Nanum-Pen-Script">
                                        {actor.peopleNm}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default MovieApiData;
