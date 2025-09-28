import { ImageResponse } from "next/og";

import profile from "@/content/json/profile.json";
import { buildSiteUrl, getSiteBaseUrl } from "@/lib/seo/index";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const gradient = "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)";

export default function Image() {
  const profileData = profile;
  const siteUrl = getSiteBaseUrl();
  const siteHost = (() => {
    try {
      return new URL(`${siteUrl}/`).host;
    } catch {
      return "thanh.dang";
    }
  })();
  const contactUrl = (() => {
    try {
      return buildSiteUrl("/contact", siteUrl);
    } catch {
      return "https://thanh.dang/contact";
    }
  })();
  const highlightTitle = "Case Studies";
  const highlightSummary = Array.isArray(profileData.focusAreas)
    ? (profileData.focusAreas[0] ?? profileData.tagline)
    : profileData.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "96px",
          backgroundImage: gradient,
          color: "#f8fafc",
          fontFamily: "Inter, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 600, opacity: 0.9 }}>
          {profileData.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <span style={{ fontSize: 22, textTransform: "uppercase", letterSpacing: 6 }}>
            Product Design · Frontend Engineering
          </span>
          <h1 style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            {highlightTitle}
          </h1>
          <p style={{ fontSize: 30, maxWidth: "80%", color: "#e2e8f0" }}>
            {highlightSummary}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 26 }}>
          <span>{profileData.headline}</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>{siteHost}</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>{contactUrl}</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
