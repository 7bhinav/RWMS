"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { useRouter } from "next/navigation";

import SpinLoading from "@/components/loading/SpinLoading";
import { Error } from "@/types/ErrorTypes";
import Toast from "@/utils/toast";
Chart.register(...registerables); // Register necessary controllers
import { Cloud, Edit, Landmark, LogOut, Recycle } from "lucide-react";
import { Lato } from "next/font/google";
import Link from "next/link";
const lato = Lato({ weight: "400", subsets: ["latin"] });
const Page = () => {
    const [user, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [chartInstance, setChartInstance] = useState<any>(null); // State to hold the chart instance

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch(`/api/auth/profile`);
                const data = await response.json();
                console.log(data);
                setUserData(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };
        getUserData();
    }, []);

    const logout = async () => {
        try {
            await axios.get("/api/auth/logout");
            Toast.SuccessshowToast("Logout Successful");
            router.refresh();
            router.push("/");
        } catch (error: unknown) {
            const Error = error as Error;
            Toast.ErrorShowToast(Error?.response?.data?.error || "Something went wrong");
        }
    };

    const calculateWastePercentage = () => {
        if (!user || !user.userData || !user.userData.wasteDumped) return { recycled: 0, nonRecycled: 0 };

        let recycledCount = 0;
        let totalWasteCount = user.userData.wasteDumped.length;

        user.userData.wasteDumped.forEach((waste: any) => {
            if (waste.isRecyleable) {
                recycledCount++;
            }
        });

        let nonRecycledCount = totalWasteCount - recycledCount;

        return {
            recycled: (recycledCount / totalWasteCount) * 100,
            nonRecycled: (nonRecycledCount / totalWasteCount) * 100,
        };
    };

    useEffect(() => {
        if (user && user.userData && user.userData.wasteDumped) {
            renderChart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const renderChart = () => {
        const ctx = document.getElementById("wasteChart") as HTMLCanvasElement;
        if (!ctx) return;

        if (chartInstance) {
            chartInstance.destroy(); // Destroy the previous chart instance
        }

        const { recycled, nonRecycled } = calculateWastePercentage() || 0;

        const newChartInstance = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Recycled", "Non-Recycled"],
                datasets: [
                    {
                        data: [recycled, nonRecycled],
                        backgroundColor: ["#259e73", "#F2BF87"],
                        hoverBackgroundColor: ["#a7ebd4", "#2e4a21"],
                    },
                ],
            },
        });

        setChartInstance(newChartInstance); // Save the new chart instance
    };
    // Function to calculate total saved CO2 emissions
    const calculateTotalCO2Saved = () => {
        if (!user || !user.userData || !user.userData.wasteDumped) return 0;

        let totalCO2Saved = 0;

        user.userData.wasteDumped.forEach((waste: any) => {
            // Assuming wasteDumped objects have a property named wastePoints indicating CO2 saved
            totalCO2Saved += waste.wastePoints || 0;
        });

        return totalCO2Saved;
    };
    return (
        <>
            {loading ? (
                <div className="min-h-screen flex justify-center items-center">
                    <SpinLoading />
                </div>
            ) : (
                <div className={`${lato.className} h-screen overflow-y-auto flex flex-col items-center bg-gray-50`}>
                    <h1 className="text-4xl font-bold tracking-wide mt-8 mb-8 text-gray-900">Profile</h1>
                    <div className="w-full max-w-md flex flex-col items-center gap-6 pb-32">
                        <div className="bg-white rounded-full shadow-lg border-2 border-gray-100 flex flex-col items-center p-6">
                            <img src={user.userData?.profilePicture || "https://i.pinimg.com/564x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg"} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" alt="" />
                            <div className="flex items-center gap-2 mt-3">
                                <h1 className="text-2xl font-bold tracking-wide capitalize text-gray-900">{user?.userData?.username}</h1>
                                <Link href={"/edit-profile"} className="bg-gray-100 p-2 rounded-lg text-gray-700 hover:bg-gray-200 transition">
                                    <Edit size={17} />
                                </Link>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 w-full flex flex-col items-center pt-10 pb-8 px-6">
                            <div className="flex justify-between w-full max-w-xs mb-6">
                                <div className="flex flex-col items-center">
                                    <Landmark size={28} className="text-green-600 mb-1" />
                                    <span className="font-bold text-lg text-gray-900">{user?.userData?.totalPointsEarned || "0"}</span>
                                    <span className="uppercase text-xs opacity-60 font-semibold tracking-wider">Points</span>
                                </div>
                                <div className="w-px bg-gray-200 mx-4"></div>
                                <div className="flex flex-col items-center">
                                    <Cloud size={28} className="text-green-600 mb-1" />
                                    <span className="font-bold text-lg text-gray-900">{calculateTotalCO2Saved() || "0"}G</span>
                                    <span className="uppercase text-xs opacity-60 font-semibold tracking-wider">Saved CO2</span>
                                </div>
                                <div className="w-px bg-gray-200 mx-4"></div>
                                <div className="flex flex-col items-center">
                                    <Recycle size={28} className="text-green-600 mb-1" />
                                    <span className="font-bold text-lg text-gray-900">{user?.userData?.wasteDumped?.length || "0"}</span>
                                    <span className="uppercase text-xs opacity-60 font-semibold tracking-wider">Recycled</span>
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-center mt-4">
                                <div className="w-40 h-40 flex items-center justify-center">
                                    <canvas id="wasteChart"></canvas>
                                </div>
                            </div>
                        </div>
                        {/* Logout button for large screens (static, with margin) */}
                        <button onClick={logout} className="hidden sm:flex items-center justify-center gap-3 text-base font-semibold w-full max-w-md p-3 rounded-xl mt-8 mb-4 text-white bg-green-600 hover:bg-green-700 transition shadow-lg">
                            <LogOut /> Logout
                        </button>
                    </div>
                    {/* Logout button for mobile (fixed at bottom) */}
                    <button onClick={logout} className="flex sm:hidden items-center justify-center gap-3 text-base font-semibold w-full max-w-md p-3 rounded-xl fixed bottom-6 left-1/2 -translate-x-1/2 text-white bg-green-600 hover:bg-green-700 transition z-20 shadow-lg">
                        <LogOut /> Logout
                    </button>
                </div>
            )}
        </>
    );
};

export default Page;
