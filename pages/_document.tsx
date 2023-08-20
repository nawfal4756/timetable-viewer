import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="manifest" href="/manifest.json"></link>
                <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
                <link rel="apple-touch-icon" sizes="256x256" href="/icon-256x256.png" />
                <link rel="apple-touch-icon" sizes="384x384" href="/icon-384x384.png" />
                <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
