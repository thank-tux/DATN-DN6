import Header from "../header";
import Head from "next/head";
import Footer from "../footer";

export default function Layout({ children }) {
  return (
    <>
      <main>
        <Head>
          <title>Thiên Lý BookStore</title>
        </Head>
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
}
