"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Product, ProductAttribute, ProductCategory } from "@/types";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "./shop-card";

interface ProductFilterClientProps {
  categories: ProductCategory[];
  attributes: ProductAttribute[];
  initialProducts: Product[];
}

const ProductFilterClient: React.FC<ProductFilterClientProps> = ({
  categories,
  attributes,
  initialProducts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubAttributes, setSelectedSubAttributes] = useState<
    { attributeId: string; subAttributeId: string }[]
  >([]);

  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategory,
      );
    }

    if (selectedSubAttributes.length > 0) {
      filtered = filtered.filter((product) => {
        const productSubAttributes = product.variations
          .flatMap((variation) => variation.subAttributes || [])
          .map((subAttribute) => subAttribute?.subAttributeId)
          .filter(Boolean);

        return selectedSubAttributes.every((selectedSubAttr) =>
          productSubAttributes.includes(selectedSubAttr.subAttributeId),
        );
      });
    }

    return filtered;
  }, [selectedCategory, selectedSubAttributes, initialProducts]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubAttributes([]);
  };

  const handleSubAttributeChange = (
    attributeId: string,
    subAttributeId: string,
    isMultiSelect: boolean,
  ) => {
    setSelectedSubAttributes((prevSelected) => {
      const alreadySelected = prevSelected.find(
        (sel) => sel.attributeId === attributeId,
      );

      if (isMultiSelect) {
        return alreadySelected
          ? prevSelected.some((sel) => sel.subAttributeId === subAttributeId)
            ? prevSelected.filter(
                (sel) => sel.subAttributeId !== subAttributeId,
              )
            : [...prevSelected, { attributeId, subAttributeId }]
          : [...prevSelected, { attributeId, subAttributeId }];
      } else {
        return [{ attributeId, subAttributeId }];
      }
    });
  };

  const renderFilterForAttribute = (attribute: ProductAttribute) => {
    const subAttributesFiltered = attribute.productSubAttributes;

    switch (attribute.filterPageType) {
      case "DEFAULT":
      case "SELECT":
        return (
          <Select
            onValueChange={(value) =>
              handleSubAttributeChange(attribute.id, value as string, false)
            }
          >
            <SelectTrigger className="h-10 w-36">
              <SelectValue placeholder={`Select ${attribute.name}`} />
            </SelectTrigger>
            <SelectContent>
              {subAttributesFiltered.map((sub) => (
                <SelectItem value={sub.id} id={sub.id} key={sub.id}>
                  {sub.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "COLOR":
        return (
          <TooltipProvider>
            <div className="flex flex-row gap-2">
              {subAttributesFiltered.map((sub) => (
                <Tooltip key={sub.id}>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() =>
                        handleSubAttributeChange(attribute.id, sub.id, true)
                      }
                      className={`h-5 w-5 cursor-pointer border ${
                        selectedSubAttributes.some(
                          (sel) => sel.subAttributeId === sub.id,
                        )
                          ? "border-black"
                          : ""
                      }`}
                      style={{
                        backgroundColor: sub.value.startsWith("#")
                          ? sub.value
                          : undefined,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{sub.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        );

      case "CHECKBOX":
        return subAttributesFiltered.map((sub) => (
          <label key={sub.id} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              value={sub.id}
              checked={selectedSubAttributes.some(
                (sel) => sel.subAttributeId === sub.id,
              )}
              onChange={() =>
                handleSubAttributeChange(attribute.id, sub.id, true)
              }
              className="form-checkbox"
            />
            <span>{sub.value}</span>
          </label>
        ));

      case "RATIO":
        return (
          <RadioGroup
            onValueChange={(value) =>
              handleSubAttributeChange(attribute.id, value as string, false)
            }
            className="space-y-2"
          >
            {subAttributesFiltered.map((sub) => (
              <label key={sub.id} className="flex items-center space-x-2">
                <RadioGroupItem value={sub.id} id={sub.id} />
                <span>{sub.value}</span>
              </label>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex h-52 w-full items-center justify-center"></div>

      <div className="flex h-full w-[1600px]">
        <div className="flex h-full min-w-60 flex-col space-y-4 px-6">
          <div className="flex h-16 w-full items-center justify-between space-x-2 border-b border-white/30">
            <p className="text-lg font-bold">Filtros</p>
            <RotateCcw
              className="h-4 w-4 cursor-pointer"
              onClick={resetFilters}
            />
          </div>
          <div className="pb-6">
            <h3 className="pb-3 text-sm font-semibold">Select Category</h3>
            <RadioGroup
              onValueChange={(value) => setSelectedCategory(value)}
              value={selectedCategory || ""}
            >
              <label className="flex items-center space-x-2 text-sm">
                <RadioGroupItem value="" />
                <span>All Categories</span>
              </label>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  <RadioGroupItem value={category.id} />
                  <span>{category.name}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {attributes.map((attribute) => (
            <div key={attribute.id} className="pb-6">
              <h3 className="pb-3 text-sm font-semibold">{attribute.name}</h3>
              <div className="space-y-2">
                {renderFilterForAttribute(attribute)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex h-full w-full flex-col px-8">
          <div className="flex items-center justify-between px-32">
            <p>Filtros selecionados:</p>
            <p>
              {selectedSubAttributes
                .map((sel) => {
                  const attribute = attributes.find(
                    (attr) => attr.id === sel.attributeId,
                  );
                  const subAttribute = attribute?.productSubAttributes.find(
                    (sub) => sub.id === sel.subAttributeId,
                  );
                  return subAttribute
                    ? `${attribute?.name}: ${subAttribute.value}`
                    : "";
                })
                .filter(Boolean)
                .join(", ") || "Nenhum"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  attributes={attributes}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-lg font-semibold">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilterClient;
