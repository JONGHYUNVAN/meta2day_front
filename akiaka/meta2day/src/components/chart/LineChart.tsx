import { ResponsiveBar } from '@nivo/bar';
import React from "react";

interface LineChartData {
    emotion: string;
    Joy: number;
    Anger: number;
    Irritation: number;
    Shyness: number;
    Sadness: number;
}

interface LineChartProps {
    data: LineChartData[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const colors = ['#eab308', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];

    return (
        <div className="h-[5vh] w-full">
            <ResponsiveBar
                // @ts-ignore
                data={data}
                keys={['Joy', 'Anger', 'Irritation', 'Shyness', 'Sadness']}
                indexBy="emotion"
                layout="horizontal"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                padding={0.3}
                colors={({ id }) => {
                    switch (id) {
                        case 'Joy': return colors[0];
                        case 'Anger': return colors[1];
                        case 'Irritation': return colors[2];
                        case 'Shyness': return colors[3];
                        case 'Sadness': return colors[4];
                        default: return '#ffffff';
                    }
                }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableLabel={true}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                label={(d) => `${d.id}`}
                enableGridY={false}
                enableGridX={false}
                tooltip={({ id, value, color }) => (
                    <div className="flex items-center p-2 text-[#ffcc86] bg-[rgba(230,180,30,0.3)] rounded-md">
                        <div
                            className="w-3 h-3 mr-2"
                            style={{ backgroundColor: color }}
                        />
                        <strong>{id}</strong>: {value}
                    </div>
                )}
            />
        </div>
    );
};

export default LineChart;
