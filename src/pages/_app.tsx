import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import Link from "next/link";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Shotmap</title>
        <meta name="description" content="Fliiga shot map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex h-12 w-full items-center justify-center bg-black pl-6 pr-6">
        <Link href={"/"} className="text-lg font-bold text-fliiga-yellow">
          Shotmap.
        </Link>
      </nav>
      <main className="flex min-h-[calc(100vh-148px)] flex-col items-center justify-center bg-gradient-to-b from-[#121212] to-[#000000]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Component {...pageProps} />
        </div>
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
