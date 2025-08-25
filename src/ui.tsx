// src/ui.tsx
import React from "react";

export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
return (
<div className="card">
{title ? <h3 className="section-title">{title}</h3> : null}
{children}
</div>
);
}

export function Field({
label,
children,
}: {
label: string;
children: React.ReactNode;
}) {
return (
<label>
{label}
<div className="field">{children}</div>
</label>
);
}

export function Button({
children,
onClick,
variant = "primary",
}: {
children: React.ReactNode;
onClick?: () => void;
variant?: "primary" | "ghost";
}) {
return (
<button className={`btn ${variant}`} onClick={onClick}>
{children}
</button>
);
}