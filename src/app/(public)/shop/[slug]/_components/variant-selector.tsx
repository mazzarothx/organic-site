"use client";

import { ProductWithDetails, SelectedVariant } from "@/types";
import { generateCompositeKey } from "@/utils/product";
import { useCallback, useEffect, useState } from "react";
import { ColorSwatch } from "./ui/color-swatch";

interface VariantSelectorProps {
  product: ProductWithDetails;
  onVariantChange: (selected: SelectedVariant) => void;
  initialSelection?: SelectedVariant | null;
}

export function VariantSelector({
  product,
  onVariantChange,
  initialSelection = null,
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedVariant, setSelectedVariant] =
    useState<SelectedVariant | null>(initialSelection);
  const [error, setError] = useState<string | null>(null);

  // Extrair valor de cor do nome (ex: "Vermelho (#FF0000)")
  const extractColorValue = useCallback(
    (colorName: string): string | undefined => {
      const hexMatch = colorName.match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/);
      if (hexMatch) return hexMatch[0];

      // Mapeamento para cores comuns sem código hexadecimal
      const colorMap: Record<string, string> = {
        preto: "#000000",
        branco: "#FFFFFF",
        vermelho: "#FF0000",
        azul: "#0000FF",
        verde: "#00FF00",
        amarelo: "#FFFF00",
        rosa: "#FFC0CB",
        cinza: "#808080",
        roxo: "#800080",
        laranja: "#FFA500",
        marrom: "#A52A2A",
        bege: "#F5F5DC",
      };

      const lowerName = colorName.toLowerCase();
      return colorMap[lowerName] || undefined;
    },
    [],
  );

  // Verificar disponibilidade de opção
  const isOptionAvailable = useCallback(
    (attributeName: string, subAttributeId: string): boolean => {
      return product.variations.some((variant) =>
        variant.attributes.some(
          (attr) =>
            attr.attributeName === attributeName &&
            attr.subAttributes.some(
              (subAttr) => subAttr.subAttributeId === subAttributeId,
            ) &&
            variant.quantity > 0,
        ),
      );
    },
    [product.variations],
  );

  // Agrupar atributos por tipo com detecção automática
  const attributeGroups = useCallback(() => {
    return product.variations.reduce(
      (acc, variant) => {
        variant.attributes.forEach((attr) => {
          const key = attr.attributeName;

          if (!acc[key]) {
            // Detectar tipo de atributo (cor, seleção, etc.)
            const isColor =
              attr.attributeName.toLowerCase().includes("cor") ||
              attr.attributeName.toLowerCase().includes("color");

            acc[key] = {
              type: isColor ? "COLOR" : "SELECT",
              options: new Map<
                string,
                {
                  id: string;
                  name: string;
                  available: boolean;
                  color?: string;
                }
              >(),
            };
          }

          attr.subAttributes.forEach((subAttr) => {
            if (!acc[key].options.has(subAttr.subAttributeId)) {
              acc[key].options.set(subAttr.subAttributeId, {
                id: subAttr.subAttributeId,
                name: subAttr.subAttributeName,
                available: isOptionAvailable(key, subAttr.subAttributeId),
                color:
                  acc[key].type === "COLOR"
                    ? extractColorValue(subAttr.subAttributeName)
                    : undefined,
              });
            }
          });
        });
        return acc;
      },
      {} as Record<
        string,
        {
          type: "COLOR" | "SELECT";
          options: Map<
            string,
            {
              id: string;
              name: string;
              available: boolean;
              color?: string;
            }
          >;
        }
      >,
    );
  }, [product.variations, extractColorValue, isOptionAvailable]);

  // Inicializar seleções com a primeira variante disponível se não houver seleção inicial
  useEffect(() => {
    if (!initialSelection && product.variations.length > 0) {
      const firstAvailableVariant = product.variations.find(
        (v) => v.quantity > 0,
      );
      if (firstAvailableVariant) {
        const initialSelections: Record<string, string> = {};
        firstAvailableVariant.attributes.forEach((attr) => {
          initialSelections[attr.attributeName] =
            attr.subAttributes[0].subAttributeId;
        });
        setSelectedOptions(initialSelections);
      }
    }
  }, [product, initialSelection]);

  // Atualizar variante selecionada quando opções mudam
  useEffect(() => {
    try {
      setError(null);
      const groups = attributeGroups();

      if (Object.keys(selectedOptions).length === Object.keys(groups).length) {
        const matchedVariant = product.variations.find((variant) =>
          variant.attributes.every(
            (attr) =>
              selectedOptions[attr.attributeName] ===
              attr.subAttributes[0].subAttributeId,
          ),
        );

        if (matchedVariant) {
          const compositeKey = generateCompositeKey(matchedVariant);
          const newSelection = { variant: matchedVariant, compositeKey };
          setSelectedVariant(newSelection);
          onVariantChange(newSelection);
        } else {
          setError(
            "Combinação indisponível. Por favor, selecione outras opções.",
          );
        }
      }
    } catch (err) {
      console.error("Error selecting variant:", err);
      setError("Erro ao selecionar variação. Por favor, tente novamente.");
    }
  }, [selectedOptions, product.variations, onVariantChange, attributeGroups]);

  const handleSelectOption = useCallback(
    (attributeName: string, optionId: string) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [attributeName]: optionId,
      }));
    },
    [],
  );

  // Renderizar opção baseada no tipo
  const renderOption = useCallback(
    (
      attributeName: string,
      option: {
        id: string;
        name: string;
        available: boolean;
        color?: string;
      },
      type: "COLOR" | "SELECT",
    ) => {
      const isSelected = selectedOptions[attributeName] === option.id;

      if (type === "COLOR" && option.color) {
        return (
          <button
            key={option.id}
            onClick={() => handleSelectOption(attributeName, option.id)}
            disabled={!option.available}
            className={`relative h-10 w-10 rounded-full border-2 transition-all ${isSelected ? "scale-110 border-black" : "border-transparent"} ${!option.available ? "cursor-not-allowed opacity-50" : "hover:scale-105"} `}
            title={option.name}
            aria-label={`Selecionar cor ${option.name}`}
          >
            <ColorSwatch color={option.color} />
            {isSelected && (
              <span className="absolute inset-0 flex items-center justify-center text-white">
                ✓
              </span>
            )}
          </button>
        );
      }

      return (
        <button
          key={option.id}
          onClick={() => handleSelectOption(attributeName, option.id)}
          disabled={!option.available}
          className={`rounded-md border px-4 py-2 text-sm transition-colors ${isSelected ? "border-black bg-black text-white" : "border-gray-300 bg-white text-gray-900"} ${!option.available ? "cursor-not-allowed opacity-50" : "hover:border-gray-900"} `}
          aria-label={`Selecionar ${option.name}`}
        >
          {option.name}
        </button>
      );
    },
    [selectedOptions, handleSelectOption],
  );

  const groups = attributeGroups();

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([attributeName, { type, options }]) => (
        <div key={attributeName} className="space-y-3">
          <h4 className="font-medium text-gray-900">{attributeName}</h4>
          <div
            className={`flex flex-wrap gap-2 ${type === "COLOR" ? "items-center" : ""}`}
          >
            {Array.from(options.values()).map((option) =>
              renderOption(attributeName, option, type),
            )}
          </div>
        </div>
      ))}

      {error && (
        <div className="rounded bg-red-50 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {selectedVariant && (
        <div className="mt-4">
          <p className="text-lg font-semibold">
            {selectedVariant.variant.salePrice ? (
              <>
                <span className="mr-2 text-gray-500 line-through">
                  R$ {selectedVariant.variant.price.toFixed(2)}
                </span>
                <span className="text-red-600">
                  R$ {selectedVariant.variant.salePrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span>R$ {selectedVariant.variant.price.toFixed(2)}</span>
            )}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {selectedVariant.variant.quantity > 0
              ? `${selectedVariant.variant.quantity} disponíveis`
              : "Esgotado"}
          </p>
        </div>
      )}
    </div>
  );
}
