"use client";
import Link from "next/link";
import React from "react";

function Footer() {
    const year = new Date().getFullYear();
    return (
        <>
            <footer className="w-full border-t h-10 text-xs flex justify-center items-center absolute bottom-0">
                <p>
                    © {year} Get Feedback by&nbsp;
                    <Link
                        target="_blank"
                        href={"https://hruthikportfolio.netlify.app/"}
                        className="font-semibold cursor-pointer hover:underline"
                    >
                        Hruthik
                    </Link>
                </p>
                <p>. All rights reserved.</p>
            </footer>
        </>
    );
}

export default Footer;
