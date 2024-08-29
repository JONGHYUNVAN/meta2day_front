'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChart from "@/components/chart/BarChart";
import PieChart from "@/components/chart/PieChart";
import DOMPurify from 'dompurify';
import {useAuthRedirect} from "@/hooks/useAuthRedirect";

interface Interest {
    id: number;
    name: string;
}

interface UserInterest {
    id: number;
    rating: number;
    interest: Interest;
}

interface Category {
    id: number;
    name: string;
}

interface UserCategory {
    id: number;
    views: number;
    category: Category;
}

interface UserStats {
    userInterests: UserInterest[];
    userCategories: UserCategory[];
}

interface BarChartData {
    id: string;
    name: string;
    rating: number;
    image: string;
}

interface PieChartData {
    id: number;
    name: string;
    views: number;
}

const MyStats: React.FC = () => {
    useAuthRedirect();
    const [barData, setBarData] = useState<BarChartData[]>([]);
    const [pieData, setPieData] = useState<PieChartData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [barAnalysis, setBarAnalysis] = useState<string>('');
    const [pieAnalysis, setPieAnalysis] = useState<string>('');
    const [displayedBarText, setDisplayedBarText] = useState<string>('');
    const [displayedPieText, setDisplayedPieText] = useState<string>('');
    const [htmlBarAnalysis, setHtmlBarAnalysis] = useState<string>('');
    const [htmlPieAnalysis, setHtmlPieAnalysis] = useState<string>('');
    const [barIndex, setBarIndex] = useState<number>(0);
    const [pieIndex, setPieIndex] = useState<number>(0);
    const colors = ['#eab308', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get<UserStats>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/stats`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                const userStats = response.data;

                const newBarData: BarChartData[] = userStats.userInterests.map((userInterest: UserInterest) => ({
                    id: userInterest.interest.id.toString(),
                    name: userInterest.interest.name,
                    rating: userInterest.rating === 0 ? 0.1: parseFloat(userInterest.rating.toFixed(1)),
                    image: `/character${userInterest.interest.id}.webp`,
                    color: colors[(userInterest.interest.id - 1) % colors.length]
                }));

                const newPieData: PieChartData[] = userStats.userCategories.map((category: UserCategory) => ({
                    id: category.category.id,
                    name: category.category.name,
                    views: category.views === 0 ? 0.1 : category.views,
                }));

                setBarData(newBarData);
                setPieData(newPieData);

                const maxBar = newBarData.reduce((prev, current) => (prev.rating > current.rating) ? prev : current);
                const minBar = newBarData.reduce((prev, current) => (prev.rating < current.rating) ? prev : current);

                const maxBarItems = newBarData.filter(item => item.rating === maxBar.rating).map(item => item.name);
                const minBarItems = newBarData.filter(item => item.rating === minBar.rating).map(item => item.name);

                const maxPie = newPieData.reduce((prev, current) => (prev.views > current.views) ? prev : current);
                const minPie = newPieData.reduce((prev, current) => (prev.views < current.views) ? prev : current);

                const maxPieItems = newPieData.filter(item => item.views === maxPie.views).map(item => item.name);
                const minPieItems = newPieData.filter(item => item.views === minPie.views).map(item => item.name);

                const getSuffix = (word: string, suffixType: '이/가' | '과/와'): string => {
                    const lastChar = word[word.length - 1];
                    const hasBatchim = (lastChar.charCodeAt(0) - 0xAC00) % 28 !== 0;

                    if (suffixType === '이/가') {
                        return hasBatchim ? '이' : '가';
                    } else if (suffixType === '과/와') {
                        return hasBatchim ? '과' : '와';
                    }

                    return '';
                };

                const formatList = (items: string[]): string => {
                    const firstItem = items[0];
                    const lastItem = items[items.length - 1];
                    const middleItems = items.slice(1, -1).join(', ');

                    if (items.length === 1) {
                        return `${firstItem}${getSuffix(firstItem, '이/가')}`;
                    } else if (items.length === 2) {
                        return `${firstItem}${getSuffix(firstItem, '과/와')} ${lastItem}${getSuffix(lastItem, '이/가')}`;
                    } else {
                        return `${firstItem}${getSuffix(firstItem, '과/와')} ${middleItems}, ${lastItem}${getSuffix(lastItem, '이/가')}`;
                    }
                };

                const barAnalysisText = `${formatList(maxBarItems)}가 가장 높은 평균 평점을 받았고,<br>${formatList(minBarItems)}가 가장 낮은 평균 평점을 받았습니다.`;
                const pieAnalysisText = `${formatList(maxPieItems)} 카테고리 중 조회수가 가장 높고,<br>${formatList(minPieItems)} 카테고리 중 조회수가 가장 낮습니다.`;

                setBarAnalysis(barAnalysisText);
                setPieAnalysis(pieAnalysisText);

                const createNeonText = (text: string, items: string[]): string => {
                    items.forEach(item => {
                        const regex = new RegExp(item, 'g');
                        text = text.replace(regex, `<span class="neon-text">${item}</span>`);
                    });
                    return DOMPurify.sanitize(text);
                };

                setHtmlBarAnalysis(createNeonText(barAnalysisText, [...maxBarItems, ...minBarItems]));
                setHtmlPieAnalysis(createNeonText(pieAnalysisText, [...maxPieItems, ...minPieItems]));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        if (barAnalysis) {
            const interval = setInterval(() => {
                setDisplayedBarText(prev => prev + barAnalysis[barIndex]);
                setBarIndex(prev => prev + 1);
            }, 5);

            if (barIndex >= barAnalysis.length) {
                clearInterval(interval);
                setDisplayedBarText(barAnalysis);
            }

            return () => clearInterval(interval);
        }
    }, [barAnalysis, barIndex]);

    useEffect(() => {
        if (pieAnalysis) {
            const interval = setInterval(() => {
                setDisplayedPieText(prev => prev + pieAnalysis[pieIndex]);
                setPieIndex(prev => prev + 1);
            }, 5);

            if (pieIndex >= pieAnalysis.length) {
                clearInterval(interval);
                setDisplayedPieText(pieAnalysis);
            }

            return () => clearInterval(interval);
        }
    }, [pieAnalysis, pieIndex]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-[50vw] w-11/12 bg-[#191919] text-white font-serif opacity-80 hover:opacity-90 transition-opacity duration-200 shadow-md rounded-lg">
            <h2 className="text-3xl text-center font-bold mb-[4vh] neon-text">My Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                    <h3 className="font-semibold text-2xl font-handwriting text-center neon-text-magenta">INTEREST</h3>
                    <div className="h-[35vh] max-h-80 ml-[2vw]">
                        <BarChart
                            // @ts-ignore
                            data={barData}
                        />
                    </div>
                    <div className="mt-[4vh] text-center Nanum-Pen-Script">
                        {barIndex >= barAnalysis.length ? (
                            <h2
                                className="text-lg neon-text-normal"
                                dangerouslySetInnerHTML={{ __html: htmlBarAnalysis }}
                            />
                        ) : (
                            <h2 className="text-lg neon-text-normal">{displayedBarText}</h2>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-2xl font-handwriting text-center neon-text-emerald">CATEGORY</h3>
                    <div className="h-[35vh] max-h-72 w-[20vw]">
                        <PieChart data={pieData} />
                    </div>
                    <div className="mt-[5vh] text-center Nanum-Pen-Script">
                        {pieIndex >= pieAnalysis.length ? (
                            <h2
                                className="text-lg neon-text-normal"
                                dangerouslySetInnerHTML={{ __html: htmlPieAnalysis }}
                            />
                        ) : (
                            <h2 className="text-lg neon-text-normal">{displayedPieText}</h2>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyStats;