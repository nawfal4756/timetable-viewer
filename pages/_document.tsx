import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="manifest" href="/manifest.json"></link>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
