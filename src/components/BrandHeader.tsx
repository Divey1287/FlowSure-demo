// src/components/BrandHeader.tsx
import React from "react";
import logoUrl from "../assets/flowsure-logo.png";

const BrandHeader: React.FC = () => {
return (
<div style={styles.wrap}>
<div style={styles.textBlock}>
<div style={styles.wordmark}>FlowSure</div>
<div style={styles.tagline}>Insurance Workflows You Can Rely On.</div>
</div>
<img src={logoUrl} alt="FlowSure" style={styles.logo} />
</div>
);
};

const styles: Record<string, React.CSSProperties> = {
// fixed overlay in the TOP-RIGHT; doesn't affect layout or block clicks
wrap: {
position: "fixed",
top: 8,
right: 12,
display: "flex",
alignItems: "center",
gap: 8,
pointerEvents: "none",
zIndex: 1000,
background: "transparent",
},
logo: { height: 24, width: 24, objectFit: "contain", borderRadius: 4 },
textBlock: { display: "flex", flexDirection: "column", lineHeight: 1.1, alignItems: "flex-end" },
wordmark: { color: "#ffffff", fontWeight: 700, fontSize: 16, textShadow: "0 1px 1px rgba(0,0,0,0.25)" },
tagline: { color: "rgba(255,255,255,0.95)", fontSize: 11, marginTop: 1, textShadow: "0 1px 1px rgba(0,0,0,0.25)" },
};

export default BrandHeader;