"use client";
import React, { useEffect, useState } from "react";
import { Bell, Cloud, History, Landmark, Recycle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import metal from "@/assets/aluminium.jpg";
import bottle from "@/assets/bottle.jpg";
import glass from "@/assets/glass.jpg";
import paper from "@/assets/paper.jpg";
import Contact from "@/components/contact";
import SpinLoading from "@/components/loading/SpinLoading";

export interface ApiResponse {
    message: string;
    userData: UserData;
}

export interface UserData {
    city: string;
    email: string;
    isVerified: boolean;
    isWorker: boolean;
    phoneNumber: string;
    profilePicture: string;
    state: string;
    totalPointsEarned: number;
    userDescription: string;
    username: string;
    wasteDumped: any[]; // You might want to define a type for wasteDumped if it has a specific structure
}

const Page = () => {
    const [user, setUserData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openNotification, setOpenNotification] = useState<boolean>(false);

    const getUserData = async () => {
        try {
            const response = await fetch(`/api/auth/profile`);
            const data = await response.json();
            console.log(data);
            setUserData(data);
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.log(error);
            return [];
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const calculateTotalCO2Saved = () => {
        if (!user || !user.userData || !user.userData.wasteDumped) return 0;

        let totalCO2Saved = 0;

        user.userData.wasteDumped.forEach((waste) => {
            // Assuming wasteDumped objects have a property named wastePoints indicating CO2 saved
            totalCO2Saved += waste.wastePoints || 0;
        });

        return totalCO2Saved;
    };

    return (
        <section className="flex flex-col gap-3 pt-2">
            {loading ? (
                <div className="min-h-screen flex justify-center items-center">
                    <SpinLoading />
                </div>
            ) : (
                <>
                    {user ? (
                        <section className="p-2 flex flex-col gap-8 relative">
                            <div className="flex items-center justify-between ">
                                <Link href={"/profile"} className="flex items-center gap-3">
                                    <img src={user.userData?.profilePicture || "https://i.pinimg.com/564x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg"} className=" w-12 h-12 rounded-xl" alt="" />
                                    <div className="flex flex-col gap-0">
                                        <h1 className=" font-semibold text-xl capitalize">Hi,{user?.userData?.username || "Unknown"}</h1>
                                        <span className=" text-sm font-medium opacity-70 ">
                                            {user?.userData?.state || "Unknown"} , {user?.userData?.city || "Unknown"}
                                        </span>
                                    </div>
                                </Link>

                                <div className="flex gap-3">
                                    <Link href={"/history"}>
                                        <History size={30} className=" opacity-60" />
                                    </Link>
                                    <Bell size={30} className=" opacity-60 relative " onClick={() => setOpenNotification(!openNotification)} />
                                    <div className={` w-44 h-56 z-50 overscroll-y-scroll absolute bg-white ${openNotification ? " scale-100" : "scale-0"} duration-200 rounded-lg top-16 shadow-md shadow-black/40 right-5 border-2 border-black/10`}></div>
                                </div>
                            </div>

                            <div className="relative flex justify-center items-center w-full min-h-[140px]">
                                {/* Black line through the center */}
                                <div className="absolute top-1/2 left-0 right-0 w-full flex items-center z-0">
                                    <div className="h-[2px] bg-black w-full" />
                                </div>
                                {/* Green gradient card above the line with subtle yellow tint */}
                                <div className="bg-gradient-to-r from-green-800 via-green-600 to-yellow-100 shadow-2xl p-6 shadow-black/30 rounded-lg max-w-xl mx-auto w-full z-10 relative">
                                    <div className="flex items-center justify-between gap-4 p-4 text-white">
                                        <div className="flex flex-col justify-center items-center">
                                            <div className="border-2 rounded-full p-1">
                                                <Landmark size={32} />
                                            </div>
                                            <span className=" font-semibold uppercase text-lg">{user?.userData.totalPointsEarned}</span>
                                            <span className="  uppercase text-xs opacity-70 font-semibold tracking-wider">Points</span>
                                        </div>

                                        <div className=" h-16 w-[3px] bg-white/40"></div>

                                        <div className="flex flex-col justify-center items-center">
                                            <div className="border-2 rounded-full p-1">
                                                <Cloud size={32} />
                                            </div>
                                            <span className=" font-semibold uppercase text-lg">{calculateTotalCO2Saved()}G</span>
                                            <span className="  uppercase text-xs opacity-70 font-semibold tracking-wider">Saved CO2</span>
                                        </div>

                                        <div className=" h-16 w-[3px] bg-white/40"></div>

                                        <div className="flex flex-col justify-center items-center">
                                            <div className="border-2 rounded-full p-1">
                                                <Recycle size={32} />
                                            </div>
                                            <span className=" font-semibold uppercase text-lg">{user?.userData?.wasteDumped?.length}</span>
                                            <span className="  uppercase text-xs opacity-70 font-semibold tracking-wider">Recycled</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 px-2 md:px-8">
                                <div className="flex justify-between items-center">
                                    <h1 className=" font-semibold  opacity-90 text-green-900 text-2xl tracking-wide">Materials</h1>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div onClick={() => {}} className="flex justify-center items-center flex-col gap-2  shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10">
                                        <Image src={bottle} alt="bottle" height={200} className=" h-24 w-24" width={200} />
                                        <h1>Plastic</h1>
                                    </div>
                                    <div onClick={() => {}} className="flex justify-center items-center flex-col  gap-2 shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10">
                                        <Image src={glass} alt="bottle" height={200} className=" h-24 w-24" width={200} />
                                        <h1>Glass</h1>
                                    </div>
                                    <div onClick={() => {}} className="flex justify-center items-center flex-col gap-2  shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10">
                                        <Image src={paper} alt="bottle" height={200} className=" h-24 w-24" width={200} />
                                        <h1>Paper</h1>
                                    </div>
                                    <div onClick={() => {}} className="flex justify-center items-center flex-col gap-2  shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10">
                                        <Image src={metal} alt="bottle" height={200} className=" h-24 w-24" width={200} />
                                        <h1>Metal</h1>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <h1 className=" text-3xl font-bold text-red-500 min-h-screen">Error loading user profile</h1>
                    )}
                </>
            )}
            {/* Report an Incident Section styled like Materials */}
            <div className="flex flex-col gap-3 px-2 md:px-8 py-4 mb-24">
                <div className="flex justify-between items-center">{/* Removed the Report an Incident heading as per user request */}</div>
                <div className="bg-white border-2 border-black/20 shadow-2xl rounded-xl p-4 md:p-8 max-w-5xl mx-auto w-full">
                    <Contact />
                </div>
            </div>
        </section>
    );
};

export default Page;
