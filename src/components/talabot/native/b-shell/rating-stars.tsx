import { StarIcon, StarFilledIcon } from "@/icons";

// Existing B icons; the recorded score stays unchanged.
export default function RatingStars({ value }: { value: unknown }) {
  if (value == null || value === "" || !Number.isFinite(Number(value)))
    return <span>—</span>;
  const score = Number(value);
  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap"
      role="img"
      aria-label={`${score} / 5`}
    >
      <span aria-hidden="true" className="me-1 tabular-nums">
        {score}
      </span>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < score;
        const Icon = filled ? StarFilledIcon : StarIcon;
        return (
          <Icon
            key={i}
            aria-hidden="true"
            className={`size-4 shrink-0 ${filled ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
          />
        );
      })}
    </span>
  );
}
