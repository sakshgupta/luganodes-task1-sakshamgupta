import { Inter } from "next/font/google";
import Image from "next/image";
import UserDashboard from "./users/Dashboard";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_COINS_API_URL}`);
        if (res.status === 429) {
            const errorMessage = await res.json();
            return {
                props: {
                    allCoins: [],
                    errorMessage: "You've exceeded the Rate Limit.",
                },
            };
        }
        const allCoins = await res.json();
        return { props: { allCoins } };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                allCoins: [],
                errorMessage: "Error fetching data. Please try again later.",
            },
        };
    }
};


export default function Home({ allCoins, errorMessage }) {
    return (
        <div>
            {errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ) : (
                <UserDashboard allCoins={allCoins} />
            )}
        </div>
    );
}
