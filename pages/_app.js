import "@/styles/globals.css";
import { AuthContextProvider } from "@/feature/auth-context";
import "font-awesome/css/font-awesome.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "@/components/layout";

export default function App({ Component, pageProps }) {
  const LayoutComponent = Component.layout || Layout;
  return (
    <AuthContextProvider>
      <LayoutComponent>
        <Component {...pageProps} />{" "}
      </LayoutComponent>{" "}
    </AuthContextProvider>
  );
}
