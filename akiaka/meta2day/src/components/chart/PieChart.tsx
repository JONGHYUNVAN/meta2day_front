import { ResponsivePie } from '@nivo/pie';

interface PieChartData {
    id: number;
    name: string;
    views: number;
}

interface PieChartProps {
    data: PieChartData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const colors = [ '#10b981','#3b82f6','#ef4444','#8b5cf6','#eab308' ];

    const formattedData = data.map((item, index) => ({
        id: item.name,
        label: item.name,
        value: item.views,
        color: colors[index % colors.length],
    }));

    return (
        <div className="animate-slide-in h-[35vh] w-[23vw] max-w-80 max-h-80">
            <ResponsivePie
                data={formattedData}
                margin={{ top: 10, right: 40, bottom: 40, left: 60 }}
                innerRadius={0.5}
                padAngle={0.3}
                cornerRadius={5}
                colors={{ datum: 'data.color' }}
                borderWidth={3}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                theme={{
                    tooltip: {
                        container: {
                            background: 'rgba(230, 180, 30, 0.3)',
                            color: '#ffcc86'
                        },
                    },
                    text: {
                        fill: "white",
                        fontSize: "clamp(10px, 3vw, 20px)",
                        fontFamily: 'Nanum Pen Script, sans-serif',
                    },
                }}
                animate={false}
            />
        </div>
    );
};

export default PieChart;
