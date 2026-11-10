import { useState } from "react";
import { Card } from "./primitives";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileInput } from "@/components/ui/file-input";
import {
  Field as BField,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PencilIcon } from "@/icons";
import { previewWrite, text, type Row } from "./domain";
import type { Field } from "./fields";
export default function NativeForm({
  title,
  fields,
  initial = {},
  t,
  confirm,
  validate,
  operation,
}: {
  title: string;
  fields: Field[];
  initial?: Row;
  t: (k: string) => string;
  confirm?: string;
  validate?: (row: Row) => string | null;
  operation?: (row: Row) => Promise<{
    error?: string | { message?: string; code?: string };
    code?: string;
    ok?: boolean;
  }>;
}) {
  const p = new URLSearchParams(location.search),
    draftKey =
      "ux02-native:draft:" +
      JSON.stringify([
        p.get("section"),
        p.get("id"),
        initial.id || "",
        fields.map((f) => f.key),
      ]);
  const [draft, setDraftState] = useState<Row>(() => {
      try {
        return (
          JSON.parse(sessionStorage.getItem(draftKey) || "null") || {
            ...initial,
          }
        );
      } catch {
        return { ...initial };
      }
    }),
    [error, setError] = useState(""),
    [confirming, setConfirming] = useState(false),
    [pending, setPending] = useState(false),
    [editing, setEditing] = useState(false);
  const setDraft = (next: Row) => {
    setDraftState(next);
    sessionStorage.setItem(draftKey, JSON.stringify(next));
  };
  async function submit() {
    if (pending) return;
    const invalid = validate?.(draft);
    if (invalid) {
      setError(t(invalid));
      return;
    }
    if (confirm && !confirming) {
      setConfirming(true);
      return;
    }
    setPending(true);
    try {
      const result = operation
        ? await operation(draft)
        : { error: previewWrite().error.message };
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
      setConfirming(false);
    }
  }
  const hasInfo = ["name", "title", "code", "phone", "address"].some(
    (key) => initial[key],
  );
  const trigger = (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
        {title}
      </h2>{" "}
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label={title}
        title={title}
        aria-expanded={editing}
        onClick={() => setEditing(true)}
      >
        <PencilIcon aria-hidden="true" />
      </Button>
    </div>
  );
  return (
    <>
      {hasInfo ? (
        <Card>
          {trigger}{" "}
          {["name", "title", "code", "phone", "address"].some(
            (key) => initial[key],
          ) && (
            <FieldGroup>
              {fields
                .filter(
                  (f) =>
                    ["name", "title", "code", "phone", "address"].includes(
                      f.key,
                    ) && initial[f.key],
                )
                .map((f) => (
                  <BField key={f.key}>
                    <FieldTitle>{t(f.label)}</FieldTitle>
                    <FieldDescription>{text(initial, f.key)}</FieldDescription>
                  </BField>
                ))}
            </FieldGroup>
          )}
        </Card>
      ) : (
        trigger
      )}
      <Dialog
        open={editing}
        onOpenChange={(open) => {
          if (!pending) setEditing(open);
        }}
      >
        <DialogContent className="max-h-[90vh] w-full overflow-hidden p-0 sm:max-w-2xl">
          <ScrollArea scrollbars="vertical" className="max-h-[90vh]">
            <div className="p-6 sm:p-8">
              <DialogHeader className="gap-1 sm:gap-2">
                <DialogTitle className="text-xl font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
                  {title}
                </DialogTitle>
                <DialogDescription>{t("nativeWriteBlocked")}</DialogDescription>
              </DialogHeader>
              {editing && (
                <form
                  className="mt-4 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                >
                  <FieldGroup>
                    {fields.map((f) => (
                      <BField
                        key={f.key}
                        orientation={
                          f.type === "checkbox" ? "horizontal" : "vertical"
                        }
                      >
                        <FieldLabel>{t(f.label)}</FieldLabel>
                        {f.type === "checkbox" ? (
                          <Checkbox
                            checked={!!draft[f.key]}
                            onCheckedChange={(checked) =>
                              setDraft({ ...draft, [f.key]: checked })
                            }
                          />
                        ) : f.options ? (
                          <Select
                            value={text(draft, f.key)}
                            items={[
                              { value: "", label: "—" },
                              ...f.options.map((v) => ({
                                value: v,
                                label: t(v),
                              })),
                            ]}
                            onValueChange={(value) =>
                              setDraft({ ...draft, [f.key]: value ?? "" })
                            }
                          >
                            <SelectTrigger aria-label={t(f.label)}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">—</SelectItem>
                              {f.options.map((v) => (
                                <SelectItem key={v} value={v}>
                                  {t(v)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : f.type === "textarea" ? (
                          <Textarea
                            maxLength={f.maxLength}
                            value={text(draft, f.key)}
                            onChange={(e) =>
                              setDraft({ ...draft, [f.key]: e.target.value })
                            }
                          />
                        ) : f.type === "file" ? (
                          <FileInput
                            accept="image/*"
                            onChange={() => setError(t("nativeWriteBlocked"))}
                          />
                        ) : (
                          <Input
                            type={f.type || "text"}
                            step={f.type === "number" ? "any" : undefined}
                            min={f.min}
                            max={f.max}
                            maxLength={f.maxLength}
                            value={
                              f.type === "date"
                                ? text(draft, f.key).slice(0, 10)
                                : text(draft, f.key)
                            }
                            onChange={(e) =>
                              setDraft({ ...draft, [f.key]: e.target.value })
                            }
                          />
                        )}
                      </BField>
                    ))}
                    <FieldDescription>
                      {t("nativeWriteBlocked")}
                    </FieldDescription>
                    {error && <FieldError>{error}</FieldError>}
                    <BField orientation="horizontal">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={pending}
                        onClick={() => setEditing(false)}
                      >
                        {t("aClose")}
                      </Button>
                      <Button type="submit" disabled={pending}>
                        {t("aSv")}
                      </Button>
                    </BField>
                  </FieldGroup>
                </form>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog
        open={confirming}
        onOpenChange={(open) => {
          if (!pending) setConfirming(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{confirm}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setConfirming(false)}
            >
              {t("aClose")}
            </Button>
            <Button type="button" disabled={pending} onClick={() => submit()}>
              {t("aSv")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
