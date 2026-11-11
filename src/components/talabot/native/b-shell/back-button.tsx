import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/icons";
import { actionColors } from "../action-colors";
export default function BackButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      className="shrink-0"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <ArrowLeftIcon
        className={`${actionColors.details} rtl:rotate-180`}
        aria-hidden="true"
      />
    </Button>
  );
}
