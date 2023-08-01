import '@/styles/globals.css'
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
      <>
          <Head>
              <link rel="shortcut icon" href="/favicon_io/favicon.ico" />
              <title>CryptoTracker</title>
          </Head>
          <Component {...pageProps} />
      </>
  );
}