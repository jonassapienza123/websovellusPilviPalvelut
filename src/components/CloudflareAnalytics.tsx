import { useEffect } from "react";

function getConsent(): boolean {
  return localStorage.getItem("consent") === "true";
}

export default function CloudflareAnalytics() {
  useEffect(() => {
    if (!getConsent()) {
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.setAttribute(
      "data-cf-beacon",
      '{"token":"2f58ce97fe4744d58e44e966f2c72f1b"}'
    );

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}