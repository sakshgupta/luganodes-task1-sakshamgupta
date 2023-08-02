import { removeUserToken } from "@/utils/removeUserToken";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";

export default function Dropdown({ userData }) {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // function to handle dropdown toggle
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // function to handle logout button click
    const handleLogout = () => {
        removeUserToken();
        router.push("/users/signin");
    };

    // Attaches an event listener for the 'mousedown' event to detect a click outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    console.log(userData);

    return (
        <li className="mr-4 cursor-pointer relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center justify-center bg-[color:var(--darker-secondary-color)] text-white text-sm font-medium rounded-md w-28 h-10 focus:outline-none"
            >
                <span className="mr-2">Profile</span>
                <FaAngleDown
                    className={`h-4 w-4 ${
                        showDropdown ? "transform rotate-180" : ""
                    }`}
                />
            </button>
            {showDropdown && (
                <div className="absolute right-0 bg-white rounded-md overflow-hidden shadow-lg z-10">
                    <div className="">
                        <div className="px-4 py-2 cursor-default hover:bg-[color:var(--primary-color)]">
                            <div className="text-gray-800 font-medium">
                                Full Name
                            </div>
                            <div className="text-gray-600">{userData.name}</div>
                        </div>
                        <hr />
                        <div className="px-4 pb-2 cursor-default hover:bg-[color:var(--primary-color)]">
                            <div className="text-gray-800 font-medium pt-2">
                                Email
                            </div>
                            <div className="text-gray-600">
                                {userData.email}
                            </div>
                        </div>
                        <hr />
                        <div className="px-4 pb-2 cursor-default hover:bg-[color:var(--primary-color)]">
                            <div className="text-gray-800 font-medium pt-2">
                                Member since
                            </div>
                            <div className="text-gray-600">
                                {new Date(userData.createdAt).getDate()}-
                                {new Date(userData.createdAt).getUTCMonth() + 1}
                                -{new Date(userData.createdAt).getFullYear()}
                            </div>
                        </div>
                        <hr />
                        {/* Add other details here */}
                    </div>
                    <div
                        onClick={handleLogout}
                        className="py-4 group hover:bg-[color:var(--darker-secondary-color)] transition-all ease-in-out"
                    >
                        <button className="text-left w-full px-4 text-gray-800 group-hover:text-white transition-all ease-in-out">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
}
