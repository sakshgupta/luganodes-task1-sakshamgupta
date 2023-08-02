import { setUserToken } from "@/utils/setUserToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Cookies from "universal-cookie";

export async function getServerSideProps(context) {
    const cookies = new Cookies(context.req.headers.cookie);
    const userId = cookies.get("user_token");
    if (!userId) {
        return {
            props: { userIdCookie: null },
        };
    }
    return {
        props: { userIdCookie: userId },
    };
}

export default function signup({ userIdCookie }) {
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        // If cookie found, Redirect to dashboard
        if (userIdCookie) {
            setStep(3); // Skip login steps

            setTimeout(() => {
                // Set success message
                setMessage({
                    errorMsg: "",
                    successMsg: "Redirecting you ...",
                });
            }, 500);

            // Redirect to dashboard
            setTimeout(() => {
                router.push("/");
            }, 800);
        }
    }, []);

    // Take all info, return account creating
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(passwordMatch){
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: username,
                        email: email,
                        password: password,
                    }),
                }
            );
            const data = await response.json();
            if (response.status === 201) {
                setMessage({ errorMsg: "", successMsg: data.msg });
                console.log(data);
                setStep(3); // Move to next step on the same page
    
                setUserToken(data.user.user_id); // set cookie when signed up
            } else {
                console.error(`Failed with status code ${response.status}`);
                setMessage({ errorMsg: data.msg, successMsg: "" });
            }
        }
        else{
            alert("Passwords do not match. Please re-enter the passwords.");
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordMatch(e.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === password);
    };

    return (
        <div className="m-2">
            {/* back button */}
            <FiArrowLeft
                onClick={() => router.push("/")}
                size={24}
                className="cursor-pointer"
            />
            {/* Page heading */}
            <div className="text-center text-3xl font-bold">Signup Page</div>

            {/* Page Content */}
            <div className="max-w-3xl mx-auto mt-10">
                {/* Steps Nav */}
                <div className="flex items-center justify-center">
                    {/* Step 2: normal-height:fit; mobile-view: 6rem */}
                    <div
                        className={`w-full h-24 lg:h-fit ${
                            step === 2 ? `font-medium` : ``
                        }`}
                    >
                        <div
                            className={`h-full border-2 rounded-l-lg px-5 py-2 ${
                                step >= 2
                                    ? `text-white bg-[color:var(--darker-secondary-color)] border-r-white border-[color:var(--darker-secondary-color)]`
                                    : `border-[color:var(--darker-secondary-color)] border-dashed`
                            }`}
                        >
                            <div>01</div>
                            Signup
                        </div>
                    </div>

                    {/* Step 3: normal-height:fit; mobile-view: 6rem */}
                    <div
                        className={`w-full h-24 lg:h-fit ${
                            step === 3 ? `font-medium` : ``
                        }`}
                    >
                        <div
                            className={`h-full border-2 border-l-0 rounded-r-lg px-5 py-2 ${
                                step >= 3
                                    ? `text-white bg-[color:var(--darker-secondary-color)] border-[color:var(--darker-secondary-color)]`
                                    : `border-[color:var(--darker-secondary-color)] border-dashed`
                            }`}
                        >
                            <div>02</div>
                            Go to Dashboard!
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {message.errorMsg && (
                    <h1 className="rounded p-3 my-2 bg-red-200 text-red-600 font-medium">
                        {message.errorMsg}
                    </h1>
                )}

                {/* Success Message */}
                {message.successMsg && (
                    <h1 className="rounded p-3 my-2 bg-green-200 text-green-600 font-medium">
                        {message.successMsg}
                    </h1>
                )}

                {/* Steps Content */}
                <div className="bg-white p-5 rounded-lg mt-2">
                    {
                        /* Step 1 Content */
                        step === 1 && (
                            <form onSubmit={setStep(2)}>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Enter your email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-full"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)]"
                                >
                                    Verify
                                </button>
                            </form>
                        )
                    }

                    {
                        /* Step 2 Content */
                        step === 2 && (
                            <form onSubmit={handleSubmit}>
                                {/* EMAIL */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Enter your email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>

                                {/* NAME */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={username}
                                        autoComplete="none"
                                        required
                                        className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12"
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Enter Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        autoComplete="none"
                                        required
                                        className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12"
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                {/* CONFIRM-PASSWORD */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        autoComplete="none"
                                        required
                                        className={`bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12 ${
                                            passwordMatch
                                                ? ""
                                                : "border-red-500"
                                        }`}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    {!passwordMatch && (
                                        <p className="text-red-500">
                                            Passwords do not match.
                                        </p>
                                    )}
                                </div>

                                <p className="text-sm text-gray-700 mt-6">
                                    *Already have an account?{" "}
                                    <a
                                        href="http://localhost:3000/users/signin"
                                        className="text-[color:var(--darker-secondary-color)]"
                                    >
                                        Signin.
                                    </a>
                                </p>

                                <button
                                    type="submit"
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)]"
                                >
                                    Complete Signup
                                </button>
                            </form>
                        )
                    }

                    {
                        /* Step 3 Content */
                        step === 3 && (
                            <div>
                                <div className="bg-green-50 border-b border-green-400 text-green-800 text-sm p-4 flex justify-between">
                                    <div>
                                        <div className="flex items-center">
                                            <p>
                                                <span className="font-bold">
                                                    Success :{" "}
                                                </span>
                                                Your account has been created!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push("/")}
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)]"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
