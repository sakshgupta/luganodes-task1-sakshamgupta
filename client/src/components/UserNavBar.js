import UserDropdown from "@/components/UserDropdown";
import { getUserToken } from "@/utils/getUserToken";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NavBar() {
    const router = useRouter();
    const [userData, setUserData] = useState({});

    const userIdCookie = getUserToken();

    // fetch the user data as soon as the page loads
    const fetchUserData = async () => {
        // If cookie was manually removed from browser
        if (!userIdCookie) {
            console.error("No cookie found! Please signin");
            // redirect to signin
            router.push("/users/signin");
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/details`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userIdCookie,
                }),
            }
        );
        if (!response.ok)
            throw new Error(`${response.status} ${response.statusText}`);

        // User Details fetched from API `/user/details`
        try {
            const data = await response.json();
            setUserData(data[0]);
        } catch (error) {
            console.error("Invalid JSON string:", error.message);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="mb-[8vh]">
            <header className="bg-[color:var(--white-color)] fixed top-0 z-50 w-full shadow-md text-[color:var(--darker-secondary-color)]">
                <div className="container mx-auto flex items-center flex-col lg:flex-row justify-between p-4">
                    <div
                        onClick={() => router.push("/")}
                        className="flex items-center gap-x-3 cursor-pointer"
                    >
                        <h1 className="m-2 text-black font-bold text-4xl">
                            CryptoYard
                        </h1>
                    </div>
                    <nav className="text-sm">
                        <ul className="flex items-center">
                            <li
                                onClick={() => router.push("/")}
                                className="mr-4 cursor-pointer"
                            >
                                <a>Dashboard</a>
                            </li>
                            <UserDropdown userData={userData} />
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
}
