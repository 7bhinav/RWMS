"use client";
import React, { useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";
import emailjs from "@emailjs/browser";
import { MailPlus } from "lucide-react";

import Toast from "@/utils/toast";

const Contact = () => {
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const form = useRef<HTMLFormElement>(null);

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            await emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID!, process.env.NEXT_PUBLIC_TEMPLATE_ID!, form.current!, process.env.NEXT_PUBLIC_PUBLIC_KEY);
            Toast.SuccessshowToast("Message Sent Successfully");
            setMessage("");
            form.current!.reset();
        } catch (error) {
            setLoading(false);
            Toast.ErrorShowToast("An error occurred, Please try again");
            console.error("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };
    return (
        <form autoComplete="off" ref={form} onSubmit={sendEmail} className="flex flex-col gap-3 mb-44 w-full px-2 md:px-0">
            <div className="flex flex-col w-full">
                <h1 className="font-semibold opacity-90 text-green-900 text-2xl tracking-wide">Report an Incident</h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {/* Email on left, message on right, select and button below email */}
                    <div className="flex flex-col gap-4 w-full md:col-span-1">
                        <input type="text" placeholder="Enter your email" name="from_email" className="border-2 border-black/40 p-3 rounded-lg bg-white shadow-sm w-full" />
                        <select name="subject" className="border-2 border-black/40 p-3 rounded-lg bg-white shadow-sm w-full">
                            <option value="Select Type of Incident">Select Type of Incident</option>
                            <option value="Overflowing Bins">Overflowing Bins</option>
                            <option value="Illegal Dumping">Illegal Dumping</option>
                            <option value="Littering">Littering</option>
                            <option value="Abandoned Waste">Abandoned Waste</option>
                            <option value="Unsanitary">Unsanitary</option>
                            <option value="Waste Spills">Waste Spills</option>
                        </select>
                        <div className="w-full">
                            {loading ? (
                                <button className="flex justify-center items-center bg-green-500 text-white gap-3 p-4 w-full rounded-lg shadow" disabled>
                                    <ScaleLoader color="#fff" className=" scale-50" /> Processing.....
                                </button>
                            ) : (
                                <button className="flex justify-center items-center gap-3 bg-green-600 text-white rounded-lg p-4 w-full shadow">
                                    <MailPlus />
                                    Report
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full md:col-span-2">
                        <textarea placeholder="Enter Your Message" className="bg-white h-32 border-black/40 p-4 rounded-lg w-full flex-auto border-2 shadow-sm" required autoComplete="false" name="message" value={message} onChange={handleMessageChange}></textarea>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Contact;
