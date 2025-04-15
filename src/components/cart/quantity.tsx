import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa";

interface QuantityProps {
  quantity: number;
  availableQuantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  showAvailableQuantity?: boolean;
}

export default function Quantity({
  quantity = 0,
  availableQuantity = 0,
  onIncrement,
  onDecrement,
  showAvailableQuantity = true,
}: QuantityProps) {
  const disabledIncrement = quantity >= availableQuantity;
  const disabledDecrement = quantity <= 1;

  return (
    <main className="flex items-center justify-between">
      <div className="relative flex flex-col items-end gap-2">
        <div className="border-dash-input-border flex h-7 w-22 items-center justify-between gap-3 rounded-lg border px-1 py-1">
          <Button
            variant="ghost"
            onClick={onDecrement}
            disabled={disabledDecrement}
            className="text-dash-text-secondary disabled:text-dash-text-disabled h-4 w-4 rounded-md"
          >
            <FaMinus className="h-3 w-3" />
          </Button>
          {availableQuantity > 0 ? (
            <span className="text-dash-text-secondary text-xs">{quantity}</span>
          ) : (
            <span className="text-dash-text-disabled text-xs">0</span>
          )}
          <Button
            variant="ghost"
            onClick={onIncrement}
            disabled={disabledIncrement}
            className="text-dash-text-secondary disabled:text-dash-text-disabled h-4 w-4 rounded-md"
          >
            <FaPlus className="h-3 w-3" />
          </Button>
        </div>
        {showAvailableQuantity && (
          <span className="text-dash-text-secondary absolute top-8 text-xs">
            available: {availableQuantity}
          </span>
        )}
      </div>
    </main>
  );
}
