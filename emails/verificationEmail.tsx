import React from "react";
import {
    Body,
    Head,
    Html,
    Link,
    Preview,
    Text,
    Heading,
    Row,
    Tailwind,
    Container,
} from "@react-email/components";

interface vericationEmail {
    username: string;
    otp: string;
}

function VerificationEmail(props: vericationEmail) {
    const { username, otp } = props;

    return (
        <>
            <Tailwind>
                <Html
                    lang="eng"
                    dir="ltr"
                >
                    <Head>
                        <title>Verification Code</title>
                    </Head>
                    <Preview>Here&apos;s your verification code: {otp}</Preview>
                    <Body>
                        <Container className="text-center">
                            <Heading>Verify your email address</Heading>
                            <Row>
                                <Text>
                                    Thank you for registering with{" "}
                                    <strong>GetFeedback</strong>. Please use the
                                    following verification code to complete your
                                    registration:
                                </Text>
                            </Row>
                            <Row>
                                <strong className="font-semibold text-lg">
                                    verification code
                                </strong>
                                <Text className="text-3xl">
                                    <strong>{otp}</strong>
                                </Text>
                            </Row>
                            <Row>
                                <Text>
                                    If you did not request this code please
                                    ignore this email.
                                </Text>
                            </Row>
                            <Row>
                                <Text className="text-xs">
                                    This message was produced and distributed by{" "}
                                    <Link href="https://hruthikportfolio.netlify.app/">
                                        GetFeedback
                                    </Link>{" "}
                                    . All rights reserved.{" "}
                                    <Link href="https://hruthikportfolio.netlify.app/">
                                        GetFeedback
                                    </Link>{" "}
                                    is a registered trademark of{" "}
                                    <Link href="https://hruthikportfolio.netlify.app/">
                                        <strong>Hruthik .</strong>
                                    </Link>
                                </Text>
                            </Row>
                        </Container>
                    </Body>
                </Html>
            </Tailwind>
        </>
    );
}

export default VerificationEmail;
