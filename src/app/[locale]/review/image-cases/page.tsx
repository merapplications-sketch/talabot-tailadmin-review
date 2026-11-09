"use client";
import { useLocale } from "next-intl";
import {
  IdentityImage,
  demoMerchantImage,
  demoPersonImage,
} from "@/components/talabot/integrated-review/identity";
import { copy } from "@/components/talabot/visual-review/copy";
import "@/components/talabot/integrated-review/polish.css";
export default function ImageCases() {
  const locale = useLocale();
  const c = copy[locale as keyof typeof copy] || copy.en;
  const wide =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="40"><rect width="1200" height="40" fill="#f36831"/></svg>',
    );
  return (
    <main className="talabot-polish min-h-dvh p-4">
      <h1>{c.samples}</h1>
      <p>{c.imageNote}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: c.photo, src: demoMerchantImage },
          { name: c.photo, src: demoPersonImage, person: true },
          { name: c.missing },
          { name: c.failed, src: "data:image/png;base64,invalid" },
          { name: c.long.repeat(14), src: wide },
          { name: c.long.repeat(14), person: true },
        ].map((x, i) => (
          <section key={i} className="rounded-2xl" data-image-case={i}>
            <div className="tp-identity">
              <IdentityImage {...x} large={i > 3} />
              <h2>{x.name}</h2>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
