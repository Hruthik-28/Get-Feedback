"use client";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Mail } from "lucide-react";
import Footer from "@/components/Footer";

function Page() {
    const content = [
        {
            title: "Message from Unknown",
            message: "The event was amazing.",
            time: "10 minutes ago",
        },
        {
            title: "Message from silvereyedeagle",
            message: "Whats your opinion on college fest?.",
            time: "1 hour ago",
        },
        {
            title: "Message from onePunchMan",
            message: "All i need is one punch on your face.",
            time: "2 weeks ago",
        },
    ];

    return (
        <>
            <main className="w-full min-h-[90vh] flex flex-col justify-center items-center space-y-12 p-4">
                <div className="space-y-4">
                    <h1 className="sm:text-5xl text-4xl text-center font-bold">
                        Want to get feedback from shadows ?
                    </h1>
                    <p className="sm:text-lg text-md text-center">
                        Get Feedback - Where your identity remains a secret.
                    </p>
                </div>
                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 1900,
                        }),
                    ]}
                    className="w-full max-w-lg"
                >
                    <CarouselContent>
                        {content.map((data, index) => (
                            <CarouselItem key={index}>
                                <Card className="sm:p-6 p-4 space-y-2">
                                    <CardTitle className="sm:text-2xl text-xl mb-5">
                                        {data.title}
                                    </CardTitle>
                                    <CardDescription className="flex dark:text-white text-black flex-col sm:flex-row sm:items-center items-start gap-4 ">
                                        <Mail />
                                        <div>
                                            <p className="text-base sm:text-lg">
                                                {data.message}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {data.time}
                                            </p>
                                        </div>
                                    </CardDescription>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </main>
            <Footer />
        </>
    );
}

export default Page;
