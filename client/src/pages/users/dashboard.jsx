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

    // dont move this state becoz it needs allcoins
    const [filteredCoins, setFilteredCoins] = useState(allCoins);

    // Update filteredCoins state whenever allCoins or filterOptions change
    useEffect(() => {
        const newFilteredCoins = allCoins.filter((event) => {
            // Check if keyword filter matches
            if (
                filterOptions.keyword.toLowerCase() &&
                !event.name
                    .toLowerCase()
                    .includes(filterOptions.keyword.toLowerCase())
            ) {
                return false;
            }

            // Check if price filter matches
            if (
                event.current_price < filterOptions.price[0] ||
                event.current_price > filterOptions.price[1]
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
                        <div className="hidden md:flex flex-col p-4 sticky top-0 w-1/6 md:w-1/4">
                            <Dashboard_Filter
                                filterOptions={filterOptions}
                                setFilterOptions={setFilterOptions}
                                handleFilterClear={handleFilterClear}
                            />
                        </div>
                        {/* Render the popup filter for small screens */}
                        {popupFilterOpen && (
                            <div className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
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
                                        filteredCoins.map((event) => (
                                            <div
                                                onClick={() => {
                                                    router.push(
                                                        `/event/${event.event_id}`
                                                    );
                                                }}
                                                className="hover:scale-105 cursor-pointer transition-all mt-5 bg-[color:var(--white-color)] rounded-lg shadow-md px-3 py-3"
                                                key={event.id}
                                            >
                                                <div className="relative h-20 w-20">
                                                    {event.image && (
                                                        <Image
                                                            className="object-contain h-full w-full rounded-md"
                                                            src={event.image}
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
                                                            {event.name.length >
                                                            30
                                                                ? event.name.slice(
                                                                      0,
                                                                      30
                                                                  ) + "..."
                                                                : event.name}
                                                        </p>
                                                        <p className="text-sm text-gray-800 pt-1.5">
                                                            ₹
                                                            {event.market_cap.toString()
                                                                .length > 12
                                                                ? event.market_cap
                                                                      .toString()
                                                                      .slice(
                                                                          0,
                                                                          12
                                                                      ) + "..."
                                                                : event.market_cap}
                                                        </p>
                                                    </div>
                                                    {/* Star component */}
                                                    <div className="flex flex-col justify-end items-center">
                                                        <p className="text-sm text-gray-800 mt-2">
                                                            <strong className="whitespace-nowrap">
                                                                ₹{" "}
                                                                {
                                                                    event.current_price
                                                                }
                                                            </strong>
                                                        </p>
                                                        <span className="w-full flex flex-row items-center">
                                                            <TfiExchangeVertical />
                                                            <span className="ml-2 text-sm">
                                                                {event.price_change_percentage_24h.toFixed(
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
                                className="md:hidden flex items-center justify-center w-[4rem] h-[4rem] text-white rounded-full bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] hover:scale-105 shadow-lg cursor-pointer transition-all ease-in-out focus:outline-none"
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
