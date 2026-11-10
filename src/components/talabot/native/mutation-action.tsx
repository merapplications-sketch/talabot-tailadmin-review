"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  label: string;
  confirm?: string;
  t: (key: string) => string;
  operation: () => Promise<{
    error?: string | { message?: string };
    ok?: boolean;
  }>;
  disabled?: boolean;
}
export default function MutationAction({
  label,
  confirm,
  t,
  operation,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  async function execute() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const result = await operation();
      if (result.error) {
        const key =
          typeof result.error === "string"
            ? result.error
            : result.error.message || "generic";
        setError(
          key === "preview_readonly"
            ? t("nativeWriteBlocked")
            : t("err_" + key),
        );
      }
    } catch {
      setError(t("err_generic"));
    } finally {
      setPending(false);
      setOpen(false);
    }
  }
  return (
    <>
      <Button
        variant="outline"
        type="button"
        disabled={disabled || pending}
        onClick={() => (confirm ? setOpen(true) : execute())}
      >
        {label}
      </Button>
      {error && <p role="alert">{error}</p>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{confirm}</DialogDescription>
          <Button variant="outline" disabled={pending} onClick={execute}>
            {label}
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => setOpen(false)}
          >
            {t("aClose2")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
