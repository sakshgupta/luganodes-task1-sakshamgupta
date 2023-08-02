import { getUserToken } from "@/utils/getUserToken";
import { useState, useRef, useEffect } from "react";

const PriceAlertPopup = ({ coinData, onClose }) => {
    const [lowerBound, setLowerBound] = useState("");
    const [upperBound, setUpperBound] = useState("");
    const popupRef = useRef();

    const userId = getUserToken();

    const handleLowerBoundChange = (e) => {
        setLowerBound(e.target.value);
    };

    const handleUpperBoundChange = (e) => {
        setUpperBound(e.target.value);
    };

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (lowerBound && upperBound && isChecked) {
                // const response = await fetch(
                //     `${process.env.NEXT_PUBLIC_API_URL}/notify/subscribe/currency`,
                //     {
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/json",
                //         },
                //         body: JSON.stringify({
                //             userId: userId,
                //             currencyId: coinData.id,
                //             lower_bound: parseFloat(lowerBound),
                //             upper_bound: parseFloat(upperBound),
                //         }),
                //     }
                // );
                // const data = await response.json();
                // if (response.status === 200) {
                //     console.log('Subscription success:', data);
                // } else {
                //     console.error(`Failed with status code ${response.status}`);
                // }
                console.log(
                    "Price alert subscription success:",
                    coinData.id,
                    " ",
                    parseFloat(lowerBound),
                    " ",
                    parseFloat(upperBound)
                );
                onClose();
            }
        } catch (error) {
            console.error("Price alert subscription error:", error);
        }
    };

    const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

    useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div ref={popupRef} className="bg-white p-8 rounded-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Set Price Alerts
                </h3>
                <p className="text-gray-800 mb-4">
                    By submitting the form below, you will receive email updates
                    when the price of {coinData.name} goes above the upper bound
                    or below the lower bound.
                </p>
                <p>
                    Current Price = ₹{coinData?.market_data?.current_price?.inr}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="lowerBound">Lower Bound:</label>
                        <input
                            type="number"
                            id="lowerBound"
                            value={lowerBound}
                            onChange={handleLowerBoundChange}
                            className="border border-[color:var(--darker-secondary-color)] px-2 py-1 rounded-md focus:outline-none focus:border-[color:var(--darker-secondary-color)]"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="upperBound">Upper Bound:</label>
                        <input
                            type="number"
                            id="upperBound"
                            value={upperBound}
                            onChange={handleUpperBoundChange}
                            className="border border-[color:var(--darker-secondary-color)] px-2 py-1 rounded-md focus:outline-none focus:border-[color:var(--darker-secondary-color)]"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <span>I agree to receive email updates.</span>
                        </label>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md focus:outline-none"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PriceAlertPopup;
