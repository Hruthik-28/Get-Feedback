"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import logoSvg from "../../../../public/Logo/SVG/main-logo-black-transparent.svg";
import Image from "next/image";
import { signInSchema } from "@/schemas/signIn.schema";

function Page() {
    const router = useRouter();
    const [isSigningIn, setIsSigningIn] = useState(false);
    
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        try {
            setIsSigningIn(true);
            const response = await axios.post<ApiResponse>("/api/sign-in");
            toast({
                title: "SignIn Success",
                description: response.data?.message,
            });
            router.push("/dashboard");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "SignIn Failed",
                description: axiosError.response?.data.message,
                variant: "destructive"
            });
        } finally {
            setIsSigningIn(false);
        }
    };
    return (
        <>
            <main className="w-full min-h-screen flex justify-center items-center">
                <div className="w-full sm:max-w-md max-w-4xl border sm:p-8 p-6 shadow-md rounded-lg">
                    <Image
                        src={logoSvg}
                        alt="logoSvg"
                        className="w-full h-28 object-cover scale-75"
                    />
                    <h4 className="font-normal text-center py-4 sm:text-lg text-sm ">
                        <span className="font-semibold">SignIn</span> now to get
                        your feedbacks
                    </h4>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username / Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your username or email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your password"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                {isSigningIn ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    "SignIn"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <span>Not a member yet?. </span>
                        <Link href={"/sign-up"}>
                            <span className="font-semibold underline hover:underline-offset-2">
                                SignUp
                            </span>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Page;
