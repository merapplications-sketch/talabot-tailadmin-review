import DetailDialog from "./b-shell/detail-dialog";
import { actionColors } from "./action-colors";
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
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import InfoField from "@/components/main/profile/personal-information/info-field";
import { PencilIcon, XIcon, ChevronRightIcon } from "@/icons";
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
  resetAfterSuccess = false,
  closeAfterSuccess = false,
  summary,
}: {
  summary?: { label: string; value: string }[];
  title: string;
  fields: Field[];
  initial?: Row;
  t: (k: string) => string;
  confirm?: string;
  validate?: (row: Row) => string | null;
  resetAfterSuccess?: boolean;
  closeAfterSuccess?: boolean;
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
    [editing, setEditing] = useState(false),
    [reading, setReading] = useState(false);
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
      } else if (result.ok === true) {
        if (resetAfterSuccess) {
          setDraft({ ...initial });
          setError("");
        }
        if (closeAfterSuccess) setEditing(false);
      }
    } catch {
      setError(t("err_generic"));
    } finally {
      setPending(false);
      setConfirming(false);
    }
  }
  const info =
    summary ??
    fields
      .filter(
        (f) =>
          ["name", "title", "code", "phone", "address"].includes(f.key) &&
          initial[f.key],
      )
      .map((f) => ({ label: t(f.label), value: text(initial, f.key) }));
  const trigger = (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
        {title}
      </h2>
      <div className="flex shrink-0 items-center gap-1">
        {info.length > 2 && (
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={t("nativeDetails") + " " + title}
            onClick={() => setReading(true)}
          >
            <ChevronRightIcon
              className={actionColors.details}
              aria-hidden="true"
            />
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label={t("aEdit") + " " + title}
          title={t("aEdit") + " " + title}
          aria-expanded={editing}
          onClick={() => setEditing(true)}
        >
          <PencilIcon className={actionColors.edit} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
  return (
    <>
      {info.length ? (
        <div
          onClick={(e) => {
            if (
              info.length > 2 &&
              !(e.target as HTMLElement).closest("button, a, input, select")
            )
              setReading(true);
          }}
        >
          <Card>
            {trigger}
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {info.slice(0, 2).map((item, i) => (
                <InfoField key={i} label={item.label} value={item.value} />
              ))}
            </div>
          </Card>
        </div>
      ) : (
        trigger
      )}
      {reading && (
        <DetailDialog
          title={title}
          backLabel={t("aBack")}
          closeLabel={t("aClose")}
          onClose={() => setReading(false)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {info.map((item, i) => (
              <InfoField key={i} label={item.label} value={item.value} />
            ))}
          </div>
        </DetailDialog>
      )}
      <Dialog
        open={editing}
        onOpenChange={(open) => {
          if (!pending) setEditing(open);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[90dvh] w-full overflow-hidden p-0 sm:max-w-2xl"
        >
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="absolute inset-e-3 top-3 z-10 bg-white dark:bg-gray-900"
                disabled={pending}
                aria-label={t("aClose")}
              >
                <XIcon aria-hidden="true" />
              </Button>
            }
          />
          <ScrollArea
            scrollbars="vertical"
            className="min-h-0"
            viewportClassName="max-h-[90dvh] overscroll-contain"
          >
            <div className="p-6 sm:p-8">
              <DialogHeader className="gap-1 pe-12 sm:gap-2">
                <DialogTitle className="text-xl font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
                  {title}
                </DialogTitle>
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
                    {error && <FieldError>{error}</FieldError>}
                    <BField orientation="horizontal">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={() => setEditing(false)}
                      >
                        {t("aClose")}
                      </Button>
                      <Button
                        type="submit"
                        variant="outline"
                        size="lg"
                        disabled={pending}
                      >
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
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{confirm}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={pending}
              onClick={() => setConfirming(false)}
            >
              {t("aClose")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={pending}
              onClick={() => submit()}
            >
              {t("aSv")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
