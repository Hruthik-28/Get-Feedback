'use client'
import { useSession } from "next-auth/react";
import React from "react";

interface Props {}

function Page(props: Props) {
    const {} = props;
    const {status} = useSession()

    return (
        <>
            <h1>Dashboard: {status}</h1>
        </>
    );
}

export default Page;
