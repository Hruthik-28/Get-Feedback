"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import Link from "next/link";
function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <>
            <nav className="w-full h-16 bg-gray-800 text-white sticky z-50 top-0 border-b flex justify-between px-4 items-center overflow-hidden">
                <Link href={"/"}>
                    <h1 className="font-bold underline underline-offset-4 hover:underline-offset-8">GetFeedback</h1>
                </Link>
                {session ? (
                    <>
                        <h4 className="sm:text-lg text-xs">
                            Hello, {user?.username || user?.email}
                        </h4>
                        <Button variant={'secondary'} onClick={() => signOut()}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Link href={"/sign-in"}>
                            <Button variant={'secondary'}>SignIn</Button>
                        </Link>
                    </>
                )}
            </nav>
        </>
    );
}

export default Navbar;
