"use client";
import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { verifySchema } from "@/schemas/verify.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import logoSvg from "../../../../../public/Logo/SVG/main-logo-black-transparent.svg";
import * as z from "zod";
import { Loader2 } from "lucide-react";

function Page() {
    const router = useRouter();
    const { username } = useParams<{ username: string }>();
    const [isVerifying, setIsVerifying] = useState(false);

    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsVerifying(true);
            const response = await axios.post<ApiResponse>("/api/verify-code", {
                username,
                verifyCode: data.code,
            });
            toast({ title: "Success", description: response.data?.message });
            router.push("/sign-in");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Failure",
                description: axiosError.response?.data.message,
                variant: "destructive",
            });
        } finally {
            setIsVerifying(false);
        }
    };
    return (
        <>
            <main className="w-full h-screen grid place-items-center">
                <div className="w-full sm:max-w-md max-w-4xl border sm:p-8 p-6 shadow-md rounded-lg">
                    <Image
                        src={logoSvg}
                        alt="logoSvg"
                        className="w-full h-28 object-scale-down scale-150"
                    />
                    <h1 className="font-bold sm:text-2xl text-xl text-center">
                        Verify Your Account
                    </h1>
                    <h4 className="font-normal text-center py-4 sm:text-lg text-sm ">
                        <span className="font-normal">
                            Enter the verification code sent to your email
                        </span>
                    </h4>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter 6 digit verifcation code"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                {isVerifying ? (
                                    <>
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        Please Wait
                                    </>
                                ) : (
                                    "Verify"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </main>
        </>
    );
}

export default Page;
