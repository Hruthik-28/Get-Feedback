"use client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Message } from "@/models/user.model";
import { X } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function MessageCard({
    message,
    removeMessage,
}: {
    message: Message;
    removeMessage: Function;
}) {
    const handleDeleteMessage = () => removeMessage(message._id);
    return (
        <>
            <Card className="w-full relative min-h-28 h-full border shadow-sm p-4 space-y-4 flex justify-between items-start">
                <div>
                    <ScrollArea className="h-[70px] ">
                        <CardTitle className="sm:text-lg text-sm mr-1">
                            {message?.content}
                        </CardTitle>
                    </ScrollArea>

                    <CardDescription className=" sm:text-sm text-xs mr-1">
                        {new Date(message?.createdAt).toLocaleString()}
                    </CardDescription>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <div className="h-8 w-8 relative bottom-4 border bg-red-500 rounded-lg flex items-center justify-center">
                            <X color="white" />
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteMessage}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </>
    );
}

export default MessageCard;
