import Dashboard_Filter from "@/components/Dashboard_Filter";
import Popup_Filter from "@/components/Popup_Filter";
import UserNavBar from "@/components/UserNavBar";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiExchangeVertical } from "react-icons/tfi";

function UserDashboard({ allCoins }) {
    // console.log(filteredCoins);
    const router = useRouter();

    const [popupFilterOpen, setPopupFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        keyword: "",
        price: [10, 5000000],
    });

    console.log(allCoins);

    // dont move this state becoz it needs allcoins
    const [filteredCoins, setFilteredCoins] = useState(allCoins);

    // Update filteredCoins state whenever allCoins or filterOptions change
    useEffect(() => {
        const newFilteredCoins = allCoins?.filter((coins) => {
            // Check if keyword filter matches
            if (
                filterOptions.keyword.toLowerCase() &&
                !coins.name
                    .toLowerCase()
                    .includes(filterOptions.keyword.toLowerCase())
            ) {
                return false;
            }

            // Check if price filter matches
            if (
                coins.current_price < filterOptions.price[0] ||
                coins.current_price > filterOptions.price[1]
            ) {
                return false;
            }

            return true;
        });

        setFilteredCoins(newFilteredCoins);
    }, [allCoins, filterOptions]);

    const handleFilterClear = () => {
        setFilterOptions({
            keyword: "",
            price: [10, 5000000],
        });
        setFilteredCoins(allCoins);
        setPopupFilterOpen(false);
    };

    return (
        <div className="pt-20 lg:pt-8 overflow-y-hidden bg-[color:var(--primary-color)]">
            <UserNavBar />
            <div className="flex m-auto">
                <div className="flex mx-auto container ">
                    <div className="flex m-auto overflow-y-hidden gap-4 lg:gap-8 w-full h-[calc(88vh)]">
                        {/* Render the regular filter for medium screens and above */}
                        {/* <div className="hidden md:flex flex-col p-4 sticky top-0 w-1/6 md:w-1/4">
                            <Dashboard_Filter
                                filterOptions={filterOptions}
                                setFilterOptions={setFilterOptions}
                                handleFilterClear={handleFilterClear}
                            />
                        </div> */}
                        {/* Render the popup filter for small screens */}
                        {popupFilterOpen && (
                            <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white rounded-lg p-4 w-5/6">
                                    <Popup_Filter
                                        filterOptions={filterOptions}
                                        setFilterOptions={setFilterOptions}
                                        handleFilterClear={handleFilterClear}
                                        handleClose={() =>
                                            setPopupFilterOpen(false)
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        {/* Render the main content of the dashboard */}
                        <div className="flex w-full md:w-3/4 mx-auto justify-between container">
                            <div className="p-4 overflow-y-auto w-full h-[calc(80vh)]">
                                <h2 className="text-lg font-medium mb-4">
                                    Coins
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filteredCoins?.status?.error_code ===
                                    429 ? (
                                        <p>Limit exceeded</p>
                                    ) : (
                                        Array.isArray(filteredCoins) &&
                                        filteredCoins.map((coins) => (
                                            <div
                                                onClick={() => {
                                                    router.push(
                                                        `/coins/${coins.id}`
                                                    );
                                                }}
                                                className="hover:scale-105 cursor-pointer transition-all mt-5 bg-[color:var(--white-color)] rounded-lg shadow-md px-3 py-3"
                                                key={coins.id}
                                            >
                                                <div className="relative h-20 w-20">
                                                    {coins.image && (
                                                        <Image
                                                            className="object-contain h-full w-full rounded-md"
                                                            src={coins.image}
                                                            alt=""
                                                            width={100}
                                                            height={100}
                                                            priority
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-row justify-between items-start mt-4">
                                                    <div className="px-2">
                                                        <p className="text-sm text-gray-800 font-bold">
                                                            {coins.name.length >
                                                            30
                                                                ? coins.name.slice(
                                                                      0,
                                                                      30
                                                                  ) + "..."
                                                                : coins.name}
                                                        </p>
                                                        <p className="text-sm text-gray-800 pt-1.5">
                                                            ₹
                                                            {coins.market_cap.toString()
                                                                .length > 12
                                                                ? coins.market_cap
                                                                      .toString()
                                                                      .slice(
                                                                          0,
                                                                          12
                                                                      ) + "..."
                                                                : coins.market_cap}
                                                        </p>
                                                    </div>
                                                    {/* Star component */}
                                                    <div className="flex flex-col justify-end items-center">
                                                        <p className="text-sm text-gray-800 mt-2">
                                                            <strong className="whitespace-nowrap">
                                                                ₹{" "}
                                                                {
                                                                    coins.current_price
                                                                }
                                                            </strong>
                                                        </p>
                                                        <span className="w-full flex flex-row items-center">
                                                            <TfiExchangeVertical />
                                                            <span className="ml-2 text-sm">
                                                                {coins.price_change_percentage_24h.toFixed(
                                                                    2
                                                                )}
                                                                %
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Bottom buttons */}
                        <div className="fixed bottom-3 right-3">
                            {/* Button to open the popup filter */}
                            <button
                                onClick={() => setPopupFilterOpen(true)}
                                className="flex items-center justify-center w-[4rem] h-[4rem] text-white rounded-full bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] hover:scale-105 shadow-lg cursor-pointer transition-all ease-in-out focus:outline-none"
                                title="Filter Coins"
                            >
                                <RxHamburgerMenu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
