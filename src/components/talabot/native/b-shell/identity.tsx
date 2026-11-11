import { IdentityImage } from "../../integrated-review/identity";
import { AvatarBadge } from "@/components/ui/avatar";
import type { ComponentProps } from "react";

export default function NativeIdentity({
  presence,
  presenceLabel,
  closed = false,
  closedLabel,
  promoted = false,
  promotedLabel,
  ...props
}: ComponentProps<typeof IdentityImage> & {
  presence?: boolean;
  presenceLabel?: string;
  closed?: boolean;
  closedLabel?: string;
  promoted?: boolean;
  promotedLabel?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 ${promoted ? "rounded-none ring-2 ring-green-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" : ""}`}
      title={promoted ? promotedLabel : undefined}
    >
      <span className={closed ? "opacity-50 grayscale" : undefined}>
        <IdentityImage {...props} />
      </span>
      {closed && (
        <span
          className="absolute inset-x-0 bottom-0 rounded-b-lg bg-gray-700 px-0.5 py-0.5 text-center text-xs font-medium text-white dark:bg-gray-600"
          role="status"
        >
          {closedLabel}
        </span>
      )}
      {presence !== undefined && (
        <AvatarBadge
          variant={presence ? "online" : "offline"}
          className="size-3"
          role="img"
          aria-label={presenceLabel}
          title={presenceLabel}
        />
      )}
    </span>
  );
}
