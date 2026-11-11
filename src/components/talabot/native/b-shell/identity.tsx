import { IdentityImage } from "../../integrated-review/identity";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

export default function NativeIdentity({
  presence,
  presenceLabel,
  closed = false,
  closedLabel,
  promoted = false,
  promotedLabel,
  onPromotedClick,
  ...props
}: ComponentProps<typeof IdentityImage> & {
  presence?: boolean;
  presenceLabel?: string;
  closed?: boolean;
  closedLabel?: string;
  promoted?: boolean;
  promotedLabel?: string;
  onPromotedClick?: () => void;
}) {
  const shape = props.person ? "rounded-full" : "rounded-xl";
  const content = (
    <span
      className={`relative inline-flex shrink-0 ${shape}`}
      title={presenceLabel || (promoted ? promotedLabel : undefined)}
    >
      <span className={`inline-flex ${closed ? "opacity-50 grayscale" : ""}`}>
        <IdentityImage {...props} />
      </span>
      {closed && (
        <span
          className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gray-700 px-0.5 py-0.5 text-center text-xs font-medium text-white dark:bg-gray-600"
          role="status"
        >
          {closedLabel}
        </span>
      )}
      {(presence !== undefined || promoted) && (
        <span
          className={`pointer-events-none absolute inset-0 border-2 ${shape} ${presence === false ? "border-red-500" : "border-green-500"}`}
          role="img"
          aria-label={presence !== undefined ? presenceLabel : promotedLabel}
          data-testid="identity-outline"
        />
      )}
    </span>
  );
  return promoted && onPromotedClick ? (
    <Button
      variant="ghost"
      className={`h-auto shrink-0 p-0 ${shape}`}
      aria-label={`${promotedLabel}: ${props.name}`}
      onClick={(event) => {
        event.stopPropagation();
        onPromotedClick();
      }}
    >
      {content}
    </Button>
  ) : (
    content
  );
}
