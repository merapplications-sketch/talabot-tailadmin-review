import { IdentityImage } from "../../integrated-review/identity";
import { AvatarBadge } from "@/components/ui/avatar";
import type { ComponentProps } from "react";

export default function NativeIdentity({
  presence,
  presenceLabel,
  ...props
}: ComponentProps<typeof IdentityImage> & {
  presence?: boolean;
  presenceLabel?: string;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <IdentityImage {...props} />
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
