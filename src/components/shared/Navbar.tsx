"use client";
import React from "react";
import { Home, MapPin, Scan, Ticket, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/verify-register" || pathname === "/verify-forget-password") {
        return null;
    }
    return (
        <nav className="fixed z-50 bottom-0 left-0 right-0 bg-white w-full shadow-2xl shadow-black">
            <div className="grid grid-cols-5 items-center px-2 py-2 bg-white w-full max-w-full sm:px-4 md:px-8 lg:px-16 mx-auto relative">
                <Link href={"/"} className="flex flex-col items-center justify-center">
                    <Home size={28} />
                    <span className="text-xs font-medium opacity-70">Home</span>
                </Link>
                <Link href={"/location"} className="flex flex-col items-center justify-center">
                    <MapPin size={28} />
                    <span className="text-xs font-medium opacity-70">Bin Station</span>
                </Link>
                <div className="flex justify-center items-center">
                    <Link href={"/scan-waste"} className="flex bg-green-700 text-white p-3 rounded-full flex-col gap-3 shadow-lg border-4 border-white -translate-y-4">
                        <Scan size={32} />
                    </Link>
                </div>
                <Link href={"/coupons"} className="flex flex-col items-center justify-center">
                    <Ticket size={28} />
                    <span className="text-xs font-medium opacity-70">coupons</span>
                </Link>
                <Link href={"/profile"} className="flex flex-col items-center justify-center">
                    <User size={28} />
                    <span className="text-xs font-medium opacity-70">Profile</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
