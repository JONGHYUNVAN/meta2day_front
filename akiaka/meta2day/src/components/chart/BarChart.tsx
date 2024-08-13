'use client';
import { ResponsiveBar } from '@nivo/bar';
import React from "react";
import Image from 'next/image';

interface BarChartData {
    id: string;
    name: string;
    rating: number;
    image: string;
    color: string;
}

interface BarChartProps {
    data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const customTick = (tick: any) => {
        const matchedData = data.find((d) => d.name === tick.value);

        return (
            <g transform={`translate(${tick.x},${tick.y + 45})`}>
                <foreignObject x="-15" y="-40" width="30" height="50">
                    {matchedData && (
                        <div className="flex flex-col items-center text-center">
                            <Image
                                src={matchedData.image}
                                alt={`Character ${matchedData.id}`}
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                            <div className="text-white text-xs -mb-10">
                                {matchedData.name}
                            </div>
                        </div>
                    )}
                </foreignObject>
            </g>
        );
    };

    return (
        <div className="h-80 w-auto">
            <ResponsiveBar
                data={data.map(d => ({
                    id: d.id,
                    name: d.name,
                    rating: d.rating,
                    image: d.image,
                }))}
                keys={['rating']}
                indexBy="name"
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={(bar) => data[bar.index].color}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                theme={{
                    tooltip: {
                        container: {
                            background: 'rgba(230, 180, 30, 0.3)',
                            color: 'white'
                        },
                    },
                    text: {
                        fill: "white",
                        fontSize: "clamp(10px, 2vw, 20px)",
                    },
                }}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    renderTick: customTick,
                }}
                tooltip={({ id, value, color, indexValue }) => (
                    <div className="flex items-center p-2 text-[#ffcc86] bg-[rgba(230,180,30,0.3)] rounded-md">
                        <div
                            className="w-3 h-3 mr-2"
                            style={{ backgroundColor: color }}
                        />
                        <strong>{indexValue}</strong>: {value}
                    </div>
                )}
                animate={true}
                layout="vertical"
            />
        </div>
    );
};

export default BarChart;
