import { Inter } from "next/font/google";
import Image from "next/image";
import UserDashboard from "./users/dashboard";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps = async () => {
    console.log("hey");
    const res = await fetch(`${process.env.NEXT_PUBLIC_COINS_API_URL}`);
    const allCoins = await res.json();
    return { props: { allCoins } };
};

export default function Home({ allCoins }) {
    return (
        <div>
            CryptoTracker
            <UserDashboard allCoins={allCoins} />
        </div>
    );
}
