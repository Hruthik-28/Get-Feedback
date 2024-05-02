"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
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
import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import googleSvg from "../../../../public/Logo/google.svg";

function Page() {
    const router = useRouter();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSigningIn(true);
        const result = await signIn("credentials", {
            ...data,
            redirect: false,
        });

        if (result?.error) {
            if (result.error === "CredentialsSignIn") {
                toast({
                    title: "SignIn Failed",
                    description: "Invalid credentials",
                    variant: "destructive",
                });
                setIsSigningIn(false);
            } else {
                toast({
                    title: "SignIn Failed",
                    description: result.error,
                });
                setIsSigningIn(false);
            }
        }

        if (result?.ok) {
            router.push("/dashboard");
        }
    };

    return (
        <>
            <main className="w-full min-h-[90vh] border flex justify-center items-center">
                <div className="w-full sm:max-w-md max-w-4xl border sm:p-8 p-6 shadow-md rounded-lg">
                    <Image
                        src={logoSvg}
                        alt="logoSvg"
                        className="w-full h-14 object-cover scale-75"
                    />

                    <h4 className="font-normal text-center py-4 sm:text-lg text-sm ">
                        <span className="font-semibold">SignIn</span> now to get
                        your feedbacks
                    </h4>
                    <div className="mt-4">
                        <Button
                            onClick={() => signIn("google")}
                            className="w-full"
                        >
                            <Image src={googleSvg} alt="googleSvg" className="scale-50"></Image>
                            Google
                        </Button>
                    </div>
                    <Separator className="my-4" />

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
                                disabled={isSigningIn}
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
