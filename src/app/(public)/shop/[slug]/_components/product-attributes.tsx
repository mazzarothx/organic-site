"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ProductAttribute,
  ProductSubAttribute,
  ProductVariation,
} from "@/types";
import { useMemo } from "react";

interface ProductAttributesProps {
  attributes?: ProductAttribute[];
  variations: ProductVariation[];
  selectedSubAttributes: { attributeId: string; subAttributeId: string }[];
  onChange: (
    attributeId: string,
    subAttributeId: string,
    isSelected: boolean,
  ) => void;
}

export const ProductAttributes = ({
  attributes = [],
  variations,
  selectedSubAttributes,
  onChange,
}: ProductAttributesProps) => {
  // Componente interno para renderizar um único atributo
  const AttributeItem = ({ attribute }: { attribute: ProductAttribute }) => {
    const allSubAttributes = useMemo(() => {
      if (!attribute || !variations) return [];

      const subAttrs = new Map<string, ProductSubAttribute>();

      variations.forEach((variation) => {
        variation.attributes?.forEach((attr) => {
          if (attr.attributeId === attribute?.id) {
            attr.subAttributes?.forEach((subAttr) => {
              if (!subAttrs.has(subAttr.subAttributeId)) {
                subAttrs.set(subAttr.subAttributeId, {
                  id: subAttr.subAttributeId,
                  name: subAttr.subAttributeName,
                  value: (subAttr as any).value || "",
                  productAttributeId: attribute?.id || "",
                  slug: "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }
            });
          }
        });
      });

      return Array.from(subAttrs.values());
    }, [variations, attribute?.id]);

    const isSelected = (subAttributeId: string) => {
      return selectedSubAttributes.some(
        (sub) =>
          sub.attributeId === attribute.id &&
          sub.subAttributeId === subAttributeId,
      );
    };

    const handleSelectionChange = (subAttributeId: string) => {
      if (isSelected(subAttributeId)) {
        onChange(attribute.id, subAttributeId, false);
      } else {
        const currentSelection = selectedSubAttributes.find(
          (sub) => sub.attributeId === attribute.id,
        );
        if (currentSelection) {
          onChange(attribute.id, currentSelection.subAttributeId, false);
        }
        onChange(attribute.id, subAttributeId, true);
      }
    };

    // Verificação de segurança para productPageType
    const attributeType = attribute.productPageType || "DEFAULT";

    switch (attributeType) {
      case "COLOR":
        return (
          <div className="mb-4">
            <div className="flex flex-row items-start justify-between">
              <h3 className="text-sm font-semibold">{attribute.name}</h3>
              <div className="flex flex-wrap gap-2">
                {allSubAttributes.map((sub) => {
                  const selected = isSelected(sub.id);
                  return (
                    <Tooltip key={sub.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleSelectionChange(sub.id)}
                          className={`hover:ring-primary flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all hover:ring-2 ${
                            selected
                              ? "ring-primary ring-2"
                              : "border-transparent"
                          }`}
                          style={{
                            backgroundColor: sub.value?.startsWith("#")
                              ? sub.value
                              : "transparent",
                            backgroundImage: sub.value?.match(/^https?:\/\//)
                              ? `url(${sub.value})`
                              : undefined,
                            backgroundSize: "cover",
                          }}
                        >
                          {selected && (
                            <span className="text-xs text-white">✓</span>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{sub.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="mb-4">
            <div className="flex flex-row items-start justify-between">
              <h3 className="text-sm font-semibold">{attribute.name}</h3>
              <div className="flex flex-wrap gap-2">
                {allSubAttributes.map((sub) => {
                  const selected = isSelected(sub.id);
                  return (
                    <Tooltip key={sub.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleSelectionChange(sub.id)}
                          className={`rounded-md border px-3 py-1 transition-all hover:bg-gray-100 ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {sub.name}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{sub.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  // Renderização principal
  if (!attributes || attributes.length === 0) {
    return (
      <div className="text-sm text-gray-500">Nenhum atributo disponível</div>
    );
  }

  return (
    <div className="space-y-4">
      {attributes.map((attribute) => (
        <AttributeItem key={attribute.id} attribute={attribute} />
      ))}
    </div>
  );
};
