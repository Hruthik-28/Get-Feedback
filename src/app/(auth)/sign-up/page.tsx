"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUp.schema";
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
import googleSvg from "../../../../public/Logo/google.svg";
import { signIn } from "next-auth/react";
import githubSvg from "../../../../public/Logo/github.svg";

function Page() {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckinngUsername] = useState(false);
    const [isSubmitting, SetIsSubmitting] = useState(false);

    const [debouncedUsername, setDebouncedUsername] = useDebounceValue(
        username,
        500
    );
    const router = useRouter();

    // zod implementaion in react hook form
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkUsernameIsUnique = async () => {
            if (debouncedUsername) {
                setIsCheckinngUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${debouncedUsername}`
                    );
                    let message = response.data.message;
                    setUsernameMessage(message);
                } catch (error: any) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    let usernameError =
                        axiosError.response?.data.message ||
                        "Error checking unique username";
                    setUsernameMessage(usernameError);
                } finally {
                    setIsCheckinngUsername(false);
                }
            }
        };
        checkUsernameIsUnique();
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        SetIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/sign-up",
                data
            );
            toast({
                title: response.data.success ? "Success" : "Failure",
                description: response.data.message,
            });
            router.push(`/verify/${data.username}`);
        } catch (error) {
            console.log(error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: "Signup Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            SetIsSubmitting(false);
        }
    };

    return (
        <>
            <main className="w-full min-h-[90vh] flex justify-center items-center">
                <div className="w-full sm:max-w-2xl max-w-4xl border sm:p-8 p-6 shadow-md rounded-lg flex sm:flex-row flex-col sm:justify-between sm:items-center sm:gap-4">
                    <section className="">
                        <Image
                            src={logoSvg}
                            alt="logoSvg"
                            className="w-full h-14 object-cover scale-75"
                        />
                        <h4 className="font-normal text-center py-4 sm:text-lg text-sm ">
                            <span className="font-semibold">SignUp</span> now to
                            get your feedbacks
                        </h4>
                        <Button
                            onClick={() => signIn("google")}
                            className="mt-4 w-full"
                        >
                            <Image
                                src={googleSvg}
                                alt="googleSvg"
                                className="scale-50"
                                onClick={() => signIn("google")}
                            ></Image>
                            Google
                        </Button>
                        <div className="mt-4">
                        <Button
                            onClick={() => signIn("github")}
                            className="w-full"
                        >
                            <Image src={githubSvg} alt="githubSvg" className="scale-50 -ml-6 p-1"></Image>
                            <span className="-ml-5">Github</span>
                        </Button>
                    </div>
                    </section>
                    <section className="">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your username"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setUsername(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {isCheckingUsername && (
                                                    <Loader2 className="text-black ml-2 w-8 h-8 animate-spin " />
                                                )}
                                                <span
                                                    className={`text-sm font-semibold ${
                                                        usernameMessage ===
                                                        "username is available"
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {usernameMessage &&
                                                        usernameMessage}
                                                </span>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="opacity-75">
                                                we will send you a verification
                                                email
                                            </FormDescription>
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </form>
                        </Form>
                        <div className="text-center mt-4">
                            <span>Already have an account? </span>
                            <Link href={"/sign-in"}>
                                <span className="font-semibold underline hover:underline-offset-2 ">
                                    SignIn
                                </span>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default Page;
