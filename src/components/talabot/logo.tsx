import Image from "next/image";

// Original approved raster, unchanged. The neutral backing preserves the navy
// wordmark's contrast in dark mode without recolouring or redrawing the logo.
export default function TalabotLogo({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-lg dark:bg-white ${compact ? "p-1" : "px-2 py-2"}`}
    >
      <Image
        src="/images/logo/talabot-original.png"
        alt="TALABOT"
        width={2404}
        height={504}
        priority
        unoptimized
        className={`${compact ? "w-14" : "w-40"} h-auto max-w-full`}
      />
    </span>
  );
}
