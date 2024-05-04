"use client";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/use-toast";
import { Message } from "@/models/user.model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessage.schema";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

function Page() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    const [messages, SetMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSwitchLoading, SetIsSwitchLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, control, setValue } = form;
    const acceptMessages = watch("acceptMessages");

    const getAcceptMessage = useCallback(async () => {
        try {
            SetIsSwitchLoading(true);
            const response = await axios.get<ApiResponse>(
                "/api/accept-messages"
            );
            setValue("acceptMessages", response.data.acceptMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Toggle Failed",
                description: axiosError.response?.data.message,
                variant: "destructive",
            });
        } finally {
            SetIsSwitchLoading(false);
        }
    }, [setValue]);

    const getMessages = useCallback(
        async (refresh: boolean = false) => {
            try {
                setLoading(true);
                SetIsSwitchLoading(false);
                const response = await axios.get<ApiResponse>(
                    "/api/get-messages"
                );
                SetMessages(response.data.messages || []);
                if (refresh) {
                    toast({
                        title: "Refresh Success",
                        description: "Showing latest messages",
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: "Failed",
                    description: axiosError.response?.data.message,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
                SetIsSwitchLoading(false);
            }
        },
        [SetMessages, setLoading]
    );

    useEffect(() => {
        if (!session || !session.user) return;
        getMessages();
        getAcceptMessage();
    }, [session, setValue, getAcceptMessage, getMessages]);

    // on switch change
    const toggleAcceptMessages = async () => {
        try {
            const response = await axios.post<ApiResponse>(
                "/api/accept-messages",
                { acceptMessages: !acceptMessages }
            );
            setValue("acceptMessages", response.data.acceptMessages);
            toast({
                title: response.data.message,
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Toggle Failed",
                description: axiosError.response?.data.message,
                variant: "destructive",
            });
        }
    };

    const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
    const urlToCopy = `${baseUrl}/u/${user?.username}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(urlToCopy);
        toast({
            title: "URL Copied!",
            description: "Profile Url has been copied to clipboard",
        });
    };

    const deleteMessage = async (messageId: any) => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message?messageId=${messageId}`
            );
            SetMessages(
                messages.filter((message) => message._id !== messageId)
            );
            toast({
                title: "Deletion Success",
                description: response?.data.message,
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Deletion Failed",
                description: axiosError.response?.data.message,
                variant: "destructive",
            });
        }
    };

    if (!session || !session.user) return <></>;

    return (
        <>
            <main className="w-full flex justify-center p-8">
                <div className="w-full max-w-6xl space-y-6">
                    <h1 className="sm:text-4xl text-lg font-bold">
                        {user?.username}&apos;s Dashboard
                    </h1>
                    <div className="flex flex-col space-y-3 ">
                        <p className="text-lg font-semibold">
                            Copy Your Unique Link
                        </p>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={urlToCopy}
                                className="border-none bg-gray-100 font-normal text-base"
                            />
                            <Button onClick={copyToClipboard}>Copy</Button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Switch
                            {...register("acceptMessages")}
                            checked={acceptMessages}
                            onCheckedChange={toggleAcceptMessages}
                            disabled={isSwitchLoading}
                        />
                        <span className="text-lg">
                            Accept Messages: {acceptMessages ? "ON" : "OFF"}
                        </span>
                    </div>
                    <Separator />
                    <Button
                        className="mt-4"
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            getMessages(true);
                        }}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="h-4 w-4" />
                        )}
                    </Button>
                    <section className="grid sm:grid-cols-2 grid-cols-1 gap-2 ">
                        {messages &&
                            messages.map((message) => (
                                <>
                                    <MessageCard
                                        message={message}
                                        key={message._id}
                                        removeMessage={deleteMessage}
                                    />
                                </>
                            ))}
                    </section>
                </div>
            </main>
        </>
    );
}

export default Page;
