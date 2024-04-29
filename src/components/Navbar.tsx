"use client";
import React, { useEffect, useState } from "react";
import logoSvg from "../../public/Logo/SVG/main-logo.svg";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const { setTheme } = useTheme();

    return (
        <>
            <nav className="w-full h-18 sticky top-0 border flex justify-between px-4 items-center overflow-hidden">
                <div className="relative left-4">
                    <Image
                        src={logoSvg}
                        alt="logoSvg"
                        height={60}
                        className="scale-150"
                    />
                </div>
                {session ? (
                    <>
                        <h4>Hello, {user?.username || user?.email}</h4>
                        <Button onClick={() => signOut()}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Link href={"/sign-in"}>
                            <Button>SignIn</Button>
                        </Link>
                    </>
                )}
            </nav>
        </>
    );
}

export default Navbar;
