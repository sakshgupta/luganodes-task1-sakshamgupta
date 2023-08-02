import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

function CoinChart({ coinId }) {
    const router = useRouter();
    const [graphData, setGraphData] = useState([]);

    // function that fetches the coin data on load
    const fetchCoin = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SINGLE_COIN_API_URL}/${coinId}/market_chart?vs_currency=inr&days=121`
            );
            if (response.ok) {
                const res = await response.json();
                // console.log(res);
                const graphData = res.prices.map(price => {
                    const [timestamp, p] = price;
                    const date = new Date(timestamp).toLocaleDateString("en-in");
                    return {
                        Date: date,
                        Price: p,
                    };
                });

                // console.log(graphData);

                setGraphData({ graphData });
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error fetching coin data:", error.message);
        }
    };

    useEffect(() => {
        fetchCoin();
    }, [coinId]); // fetch coin on component mount and when coinId changes

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={graphData.graphData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="Price"
                        stroke="var(--darker-secondary-color)"
                        fill="var(--darker-secondary-color)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CoinChart;
