"use client";
import { useLocale } from "next-intl";
import { copy } from "../visual-review/copy";
import { useCallback, useState } from "react";

export const demoMerchantImage = "/images/cards/card-01.png";
export const demoPersonImage = "/images/user/user-01.jpg";

// Presentation-only demo imagery; never a registered entity photograph.
export function IdentityImage({
  name,
  src,
  person = false,
  large = false,
}: {
  name: string;
  src?: string;
  person?: boolean;
  large?: boolean;
}) {
  return (
    <ImageState
      key={src || "missing"}
      name={name}
      src={src}
      person={person}
      large={large}
    />
  );
}
function ImageState({
  name,
  src,
  person,
  large,
}: {
  name: string;
  src?: string;
  person: boolean;
  large: boolean;
}) {
  const locale = useLocale();
  const c = copy[locale as keyof typeof copy] || copy.en;
  const [failed, setFailed] = useState(false);
  const inspect = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth === 0) setFailed(true);
  }, []);
  return (
    <span
      className="tp-avatar"
      data-person={person}
      data-large={large}
      data-fallback={!src || failed}
      role="img"
      aria-label={name}
      title={c.imageNote}
    >
      {src && !failed ? (
        <img
          ref={inspect}
          src={src}
          alt=""
          width={large ? 80 : 48}
          height={large ? 80 : 48}
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">
          {name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => [...s][0])
            .join("")}
        </span>
      )}
    </span>
  );
}
