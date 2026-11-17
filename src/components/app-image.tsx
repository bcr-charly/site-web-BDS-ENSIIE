import Image from "next/image";

type AppImageProps = {
  src: string | null;
  alt: string;
  label: string;
  className?: string;
};

export function AppImage({ src, alt, label, className }: AppImageProps) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={`flex items-center justify-center bg-bds-orange font-display text-4xl font-extrabold text-bds-black ${className ?? ""}`}
      >
        {label}
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className={`object-cover ${className ?? ""}`} />;
}
