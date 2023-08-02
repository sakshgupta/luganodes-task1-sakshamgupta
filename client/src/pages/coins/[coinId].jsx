import CoinChart from "@/components/Coin_Chart";
import PriceAlertPopup from "@/components/PriceAlertPopup";
import SubscribePopup from "@/components/SubscribePopup";
import UserNavBar from "@/components/UserNavBar";
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
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isPriceAlerting, setIsPriceAlerting] = useState(false);

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

    const handleSubscribe = () => {
        setIsSubscribing(true); // Set some state to track if the popup is open
    };

    const handlePriceAlerts = () => {
        setIsPriceAlerting(true); // Set some state to track if the popup is open
    };

    const handleUnsubscribe = async () => {
        const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/notify/remove/subscribe`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: userId,
                            currencyId: coinId,
                        }),
                    }
                );
                const data = await response.json();
                if (response.status === 200) {
                    console.log("Subscription success:", data);
                    alert(data.message);
                    setIsSubscribing(false);
                } else {
                    console.error(`Failed with status code ${response.status}`);
                }
  };

    const handleRemovePriceAlerts = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/currency/deletelimit`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    currencyId: coinId,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            console.log("Subscription success:", data);
            alert(data.message);
            setIsSubscribing(false);
        } else {
            console.error(`Failed with status code ${response.status}`);
        }
    };

    if (!coinData || !coinData?.image?.large)
        // If coin data isn't loaded correctly, it should recall API
        return <div onLoad={fetchCoin()}>loading...</div>;
    else
        return (
            <div className="pt-20 lg:pt-8 bg-[color:var(--primary-color)]">
                <UserNavBar />
                <div className="flex flex-col items-center justify-center">
                    <Head>
                        <title>{coinData?.name}</title>
                    </Head>
                    {/* Top div with image */}
                    <div className="relative h-40 sm:h-[25rem] overflow-hidden container shadow-lg">
                        <div className="absolute inset-0 w-full h-40 sm:h-[25rem] container">
                            <CoinChart coinId={coinId} />
                        </div>
                    </div>

                    {/* Second div with coin details */}
                    <div className="container bg-white py-4 mt-4 rounded-lg shadow-md">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="relative h-24 w-24 mb-4 md:mb-0 md:mr-4">
                                        <Image
                                            src={coinData.image?.large}
                                            alt={coinData.name}
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                            {coinData?.name}
                                        </h1>
                                        <div className="flex flex-col md:flex-row">
                                            <div className="text-md text-gray-800 mr-4">
                                                <span className="font-bold">
                                                    Symbol:
                                                </span>{" "}
                                                {coinData?.symbol}
                                            </div>
                                            <div className="text-md text-gray-800 mr-4">
                                                <span className="font-bold">
                                                    Current Price:
                                                </span>{" "}
                                                ₹
                                                {
                                                    coinData.market_data
                                                        ?.current_price.inr
                                                }
                                            </div>
                                            <div className="text-md text-gray-800 mr-4">
                                                <span className="font-bold">
                                                    Market Cap:
                                                </span>{" "}
                                                ₹
                                                {
                                                    coinData.market_data
                                                        ?.market_cap.inr
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-gray-300 mt-8 mb-4"></div>
                            <div className="flex flex-col md:flex-row md:items-center gap-x-10">
                                <div className="flex flex-col mb-4 md:mb-0 md:mr-10">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Rank
                                    </h3>
                                    <p className="text-gray-800">
                                        {coinData.market_data?.market_cap_rank}
                                    </p>
                                </div>
                                <div className="flex flex-col mb-4 md:mb-0">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Price Change (24h)
                                    </h3>
                                    <p className="text-gray-800">
                                        {coinData.market_data
                                            ?.price_change_24h > 0
                                            ? "+"
                                            : "-"}
                                        {coinData.market_data?.price_change_24h?.toFixed(
                                            2
                                        )}
                                    </p>
                                </div>
                                <div className="flex flex-grow md:flex-none md:mt-0 md:ml-auto">
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
                                            __html: coinData?.description.en,
                                        }}
                                    />
                                </div>
                                <div className="mb-4 bg-white px-6 py-4 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Subscription
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Choose your subscription type and
                                        subscribe for daily updates or set price
                                        alerts for each coin:
                                    </p>
                                    <div className="flex flex-col space-y-2 mb-6">
                                        <button
                                            onClick={() => handleSubscribe()}
                                            className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md focus:outline-none"
                                        >
                                            Subscribe for Daily Updates
                                        </button>
                                        <button
                                            onClick={() => handlePriceAlerts()}
                                            className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md focus:outline-none"
                                        >
                                            Set Price Alerts
                                        </button>
                                    </div>

                                    <p className="text-gray-600 mb-4">
                                        If you have any older subscription you can remove it from here:
                                    </p>
                                    <div className="flex flex-col space-y-2 mb-6">
                                        <button
                                            onClick={() => handleUnsubscribe()}
                                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none"
                                        >
                                            Unsubscribe from Daily Updates
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleRemovePriceAlerts()
                                            }
                                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none"
                                        >
                                            Remove Price Alerts
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isSubscribing && (
                    <SubscribePopup
                        coinData={coinData}
                        onClose={() => setIsSubscribing(false)}
                    />
                )}

                {isPriceAlerting && (
                    <PriceAlertPopup
                        coinData={coinData}
                        onClose={() => setIsPriceAlerting(false)}
                    />
                )}
            </div>
        );
}

export default CoinPage;
