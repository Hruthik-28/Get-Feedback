"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

function Page() {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckinngUsername] = useState(false);
    const [isSubmitting, SetIsSubmitting] = useState(false);

    const [debouncedUsername, setDebouncedUsername] = useDebounceValue(
        username,
        500
    );
    const { toast } = useToast();
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
                    setUsernameMessage(response.data?.message);
                } catch (error: any) {
                    console.log(error);
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ||
                            "Error checking unique username"
                    );
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
            <main className="w-full min-h-screen grid place-items-center">
                <div className="w-96 border p-8 shadow-md rounded-lg ">
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
                                                    setUsername(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-green-500 font-medium">
                                            {usernameMessage && usernameMessage}
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
                            <span className="font-semibold">SignIn</span>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Page;
