// @/app/(public)/shop/[slug]/_components/ui/quantity.tsx
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa";

interface QuantityProps {
  quantity: number;
  availableQuantity: number;
  minQuantity?: number;
  multiQuantity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function Quantity({
  quantity = 1,
  availableQuantity = 0,
  minQuantity = 1,
  multiQuantity = 1,
  onIncrement,
  onDecrement,
}: QuantityProps) {
  // Calcula se os botões devem estar desabilitados
  const isIncrementDisabled =
    quantity >= availableQuantity ||
    (multiQuantity > 1 && quantity + multiQuantity > availableQuantity);

  const isDecrementDisabled = quantity <= minQuantity;

  // Calcula a próxima quantidade considerando o múltiplo
  const getNextQuantity = (current: number, direction: "up" | "down") => {
    if (direction === "up") {
      return multiQuantity > 1
        ? Math.min(current + multiQuantity, availableQuantity)
        : current + 1;
    } else {
      return multiQuantity > 1
        ? Math.max(current - multiQuantity, minQuantity)
        : current - 1;
    }
  };

  return (
    <div className="flex items-start justify-between">
      <h3 className="text-sm font-semibold">Quantidade</h3>

      <div className="flex flex-col items-end gap-2">
        <div className="border-dash-input-border flex h-9 w-24 items-center justify-between rounded-lg border px-1 py-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDecrement}
            disabled={isDecrementDisabled}
            className="text-dash-text-secondary disabled:text-dash-text-disabled h-6 w-6 rounded-md"
            aria-label="Reduzir quantidade"
          >
            <FaMinus className="h-3 w-3" />
          </Button>

          <span
            className={`text-sm font-medium ${availableQuantity === 0 ? "text-dash-text-disabled" : ""}`}
          >
            {availableQuantity > 0 ? quantity : 0}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={onIncrement}
            disabled={isIncrementDisabled}
            className="text-dash-text-secondary disabled:text-dash-text-disabled h-6 w-6 rounded-md"
            aria-label="Aumentar quantidade"
          >
            <FaPlus className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-dash-text-secondary text-xs">
            Disponível: {availableQuantity}
          </span>
          {multiQuantity > 1 && (
            <span className="text-dash-text-secondary text-xs">
              Múltiplo de: {multiQuantity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
