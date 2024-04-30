"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/message.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCompletion } from "ai/react";
import defaultSuggestions from "@/data/suggestions.json";

function Page() {
    const { username } = useParams<{ username: string }>();
    const [sending, setIsSending] = useState(false);

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            setIsSending(true);
            const response = await axios.post<ApiResponse>(
                "/api/send-message",
                { ...data, username }
            );
            toast({
                title: "Send Success",
                description: response?.data.message,
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Failed to send",
                description: axiosError?.response?.data.message,
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    const { completion, isLoading, complete, setCompletion } = useCompletion({
        api: "/api/suggest-messages",
    });

    useEffect(() => {
        setCompletion(defaultSuggestions);
    }, []);

    const getStreamedResponse = () => {
        complete("");
    };

    return (
        <>
            <main className="grid place-items-center p-8">
                <h1 className="sm:text-4xl text-2xl font-bold">
                    Public Profile Link
                </h1>
                <div className="w-full max-w-4xl mt-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Send Anonymous Message to @
                                            {username}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write your anonymous message here"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="w-full flex justify-center">
                                <Button
                                    type="submit"
                                    className="mx-auto"
                                    disabled={sending}
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 text-white animate-spin mr-2" />
                                            sending
                                        </>
                                    ) : (
                                        "Send It"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className="w-full max-w-4xl mt-8 flex flex-col  space-y-4">
                    <div className="flex sm:justify-start justify-center">
                        <Button
                            disabled={isLoading}
                            type="submit"
                            onClick={getStreamedResponse}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 text-white animate-spin mr-2" />
                                    Casting magic spell
                                </>
                            ) : (
                                "Suggest Messages ( A.I )"
                            )}
                        </Button>
                    </div>
                    <p>Click on any message below to select it.</p>
                    <Card className="p-6 space-y-6">
                        <CardTitle>Messages</CardTitle>
                        {completion &&
                            completion.split("||").map((suggestion, index) => (
                                <CardDescription
                                    key={index}
                                    className="text-black text-sm text-center border rounded-md p-2 font-medium cursor-pointer hover:opacity-75"
                                    onClick={() => {
                                        form.setValue("content", suggestion);
                                    }}
                                >
                                    {suggestion}
                                </CardDescription>
                            ))}
                    </Card>
                </div>
            </main>
        </>
    );
}

export default Page;
