import UserNavBar from "@/components/UserNavBar";
import CoinChart from "@/components/Coin_Chart";
import { getUserToken } from "@/utils/getUserToken";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function CoinPage() {
    const router = useRouter();
    const coinId = router.query.coinId;
    const userId = getUserToken();
    const [coinData, setCoinData] = useState([]);

    // function to handle share button click
    const share = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: coinData.name,
                    text: "Check out this coin!",
                    url: window.location.href,
                })
                .then(() => console.log("Successful share"))
                .catch((error) => console.log("Error sharing", error));
        }
    };

    // function that fetches the coin data on load
    const fetchCoin = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SINGLE_COIN_API_URL}/${coinId}`
            );
            if (response.ok) {
                const data = await response.json();
                setCoinData(data);
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

    if (!coinData || !coinData?.image?.large)
        // If coin data isn't loaded correctly, it should recall API
        return <div onLoad={fetchCoin()}>loading...</div>;
    else
        return (
            <div className="pt-20 lg:pt-8 bg-[color:var(--primary-color)]">
                <UserNavBar />
                <div className="flex flex-col items-center justify-center">
                    <Head>
                        <title>{coinData.name}</title>
                    </Head>
                    {/* Top div with image */}
                    <div className="relative h-40 sm:h-[25rem] overflow-hidden container shadow-lg">
                        <div className="absolute inset-0 w-full h-40 sm:h-[25rem] container">
                            <CoinChart coinId={coinId} />
                        </div>
                    </div>

                    {/* Second div with coin details and ticket pricing */}
                    <div className="container bg-white py-4 mt-4 rounded-lg shadow-md">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                        {coinData.name}
                                    </h1>
                                    <div className="flex flex-col md:flex-row">
                                        <div className="text-md text-gray-800 mr-4">
                                            <span className="font-bold">
                                                Date:
                                            </span>{" "}
                                            {coinData.date}
                                        </div>
                                        <div className="text-md text-gray-800 mr-4">
                                            <span className="font-bold">
                                                Time:
                                            </span>{" "}
                                            {coinData.time}
                                        </div>
                                        <div className="text-md text-gray-800 mr-4">
                                            <span className="font-bold">
                                                Venue:
                                            </span>{" "}
                                            {coinData.venue}
                                        </div>
                                        <div className="text-md text-gray-800 mr-4">
                                            <span className="font-bold">
                                                Organizer:
                                            </span>{" "}
                                            {coinData.organizer}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left lg:text-right mt-4 lg:mt-0">
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/coin/${coinId}/payment`
                                            )
                                        }
                                        className="px-6 py-2 bg-gray-700 hover:bg-gray-800"
                                    >
                                        Already Registered
                                    </button>
                                </div>
                            </div>
                            <div className="border-b border-gray-300 mt-8 mb-4"></div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Ticket Pricing
                                    </h3>
                                    <p className="text-gray-800">
                                        ₹{coinData.price}
                                    </p>
                                </div>
                                <div className="flex mt-4 md:mt-0">
                                    <button
                                        onClick={share}
                                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                                    >
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Third div with major coin details */}
                    <div className="container mt-4 bg-[color:var(--primary-color)]">
                        <div className="container">
                            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                                <div className="mb-4 max-w-5xl bg-white px-6 py-4 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        About the Coin
                                    </h3>
                                    <p
                                        className="text-gray-600 text-md coin-description"
                                        dangerouslySetInnerHTML={{
                                            __html: coinData.description.en,
                                        }}
                                    />
                                </div>
                                <div className="mb-4 bg-white px-6 py-4 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Ticket Prices
                                    </h3>
                                    <ul className="text-gray-600">
                                        {[
                                            {
                                                type: "General*",
                                                price: coinData.price,
                                            },
                                            {
                                                type: "VIP*",
                                                price: 2 * coinData.price,
                                            },
                                            {
                                                type: "VVIP*",
                                                price: 4 * coinData.price,
                                            },
                                        ].map((item, index) => (
                                            <li
                                                className="flex items-center h-16 py-1 rounded-md p-4 mb-2 hover:shadow-md"
                                                key={index}
                                            >
                                                <span className="w-1/3">
                                                    {item.type}
                                                </span>
                                                <span className="w-1/3 text-center">
                                                    ₹{item.price}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/coin/${coinId}/payment`
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-gray-700 hover:bg-gray-800"
                                                >
                                                    Registered
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-sm text-[color:var(--darker-secondary-color)] mt-6">
                                        *Caution: All ticket sales are final and
                                        non-refundable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}

export default CoinPage;
