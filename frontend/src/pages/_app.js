import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pageview, loadGA4Script } from "@/utils/google-analytics";
export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    loadGA4Script();
    pageview(window.location.pathname);

    const handleRouteChange = (url) => {
      pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
