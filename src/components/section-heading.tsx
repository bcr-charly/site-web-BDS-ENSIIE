import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
  dark?: boolean;
};

export function SectionHeading({ title, subtitle, linkHref, linkLabel, dark = false }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className={`font-display text-3xl font-extrabold md:text-4xl ${dark ? "text-bds-black" : "text-white"}`}>
          {title}
        </h2>
        {subtitle ? <p className={`mt-2 max-w-2xl ${dark ? "text-bds-black/70" : "text-white/70"}`}>{subtitle}</p> : null}
      </div>
      {linkHref && linkLabel ? (
        <Link
          href={linkHref}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            dark
              ? "border-bds-black text-bds-black hover:bg-bds-black hover:text-white"
              : "border-bds-orange text-bds-orange hover:bg-bds-orange hover:text-bds-black"
          }`}
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
