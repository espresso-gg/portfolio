interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, body, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`section-header ${align === "center" ? "section-header--center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <p className="section-lede">{body}</p> : null}
    </div>
  );
}
