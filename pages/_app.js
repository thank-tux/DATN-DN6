import "@/styles/globals.css";
import { AuthContextProvider } from "@/feature/auth-context";
import Layout from "@/components/layout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartContextProvider } from "@/feature/cart-context";

export default function App({ Component, pageProps }) {
  return (
    <CartContextProvider>
      <AuthContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthContextProvider>
    </CartContextProvider>
  );
}
