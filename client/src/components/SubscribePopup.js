import { getUserToken } from "@/utils/getUserToken";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

const SubscribePopup = ({ coinData, onClose }) => {
    const [isChecked, setIsChecked] = useState(false);
    const userId = getUserToken();
    const popupRef = useRef();

    console.log(userId);

    const handleCheckboxChange = () => {
        setIsChecked((prev) => !prev);
    };

    const handleSubscribe = async () => {
        try {
            if (isChecked) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/notify/subscribe/currency`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: userId,
                            currencyId: coinData.id,
                        }),
                    }
                );
                const data = await response.json();
                if (response.status === 200) {
                    console.log("Subscription success:", data);
                    alert(data.message);
                    onClose();
                } else {
                    console.error(`Failed with status code ${response.status}`);
                }
            }
        } catch (error) {
            console.error("Subscription error:", error);
        }
    };

    const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div ref={popupRef} className="bg-white p-8 rounded-md">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer focus:outline-none"
                    onClick={onClose}
                >
                    <MdClose size={24} />
                </button>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Subscribe for Daily Updates
                </h3>
                <p className="text-gray-800 mb-4">
                    By checking the box below and submitting, you will receive
                    email updates on {coinData.name} every 24 hours.
                </p>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <span>I agree to receive email updates.</span>
                </label>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSubscribe}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md focus:outline-none"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscribePopup;
