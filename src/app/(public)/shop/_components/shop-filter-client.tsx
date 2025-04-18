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
import ShopCard from "./shop-card";

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
    return initialProducts.filter((product) => {
      // Filter by category
      if (selectedCategory && product.category?.id !== selectedCategory) {
        return false;
      }

      // Filter by attributes
      if (selectedSubAttributes.length > 0) {
        const hasAllAttributes = selectedSubAttributes.every((selected) => {
          return product.variations.some((variation) =>
            variation.attributes.some(
              (attr) =>
                attr.attributeId === selected.attributeId &&
                attr.subAttributes.some(
                  (sub) => sub.subAttributeId === selected.subAttributeId,
                ),
            ),
          );
        });

        if (!hasAllAttributes) return false;
      }

      return true;
    });
  }, [initialProducts, selectedCategory, selectedSubAttributes]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubAttributes([]);
  };

  const handleSubAttributeChange = (
    attributeId: string,
    subAttributeId: string,
    isMultiSelect: boolean,
  ) => {
    setSelectedSubAttributes((prev) => {
      if (isMultiSelect) {
        const existingIndex = prev.findIndex(
          (item) =>
            item.attributeId === attributeId &&
            item.subAttributeId === subAttributeId,
        );

        if (existingIndex >= 0) {
          return prev.filter((_, index) => index !== existingIndex);
        }
        return [...prev, { attributeId, subAttributeId }];
      } else {
        // For single select, replace any existing selection for this attribute
        return prev
          .filter((item) => item.attributeId !== attributeId)
          .concat([{ attributeId, subAttributeId }]);
      }
    });
  };

  const renderFilterForAttribute = (attribute: ProductAttribute) => {
    const subAttributes = attribute.productSubAttributes || [];

    switch (attribute.filterPageType) {
      case "COLOR":
        return (
          <TooltipProvider>
            <div className="flex flex-wrap gap-2">
              {subAttributes.map((sub) => (
                <Tooltip key={sub.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() =>
                        handleSubAttributeChange(attribute.id, sub.id, true)
                      }
                      className={`h-6 w-6 rounded-full border-2 transition-all ${
                        selectedSubAttributes.some(
                          (s) => s.subAttributeId === sub.id,
                        )
                          ? "border-primary scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: sub.value }}
                      aria-label={sub.name}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{sub.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        );

      case "CHECKBOX":
        return (
          <div className="space-y-2">
            {subAttributes.map((sub) => (
              <label key={sub.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSubAttributes.some(
                    (s) => s.subAttributeId === sub.id,
                  )}
                  onChange={() =>
                    handleSubAttributeChange(attribute.id, sub.id, true)
                  }
                  className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                />
                <span>{sub.name}</span>
              </label>
            ))}
          </div>
        );

      case "SELECT":
        return (
          <Select
            onValueChange={(value) =>
              handleSubAttributeChange(attribute.id, value, false)
            }
            value={
              selectedSubAttributes.find((s) => s.attributeId === attribute.id)
                ?.subAttributeId || ""
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${attribute.name}`} />
            </SelectTrigger>
            <SelectContent>
              {subAttributes.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "RATIO":
        return (
          <RadioGroup
            value={
              selectedSubAttributes.find((s) => s.attributeId === attribute.id)
                ?.subAttributeId || ""
            }
            onValueChange={(value) =>
              handleSubAttributeChange(attribute.id, value, false)
            }
            className="space-y-2"
          >
            {subAttributes.map((sub) => (
              <div key={sub.id} className="flex items-center gap-2">
                <RadioGroupItem
                  value={sub.id}
                  id={`${attribute.id}-${sub.id}`}
                />
                <label htmlFor={`${attribute.id}-${sub.id}`}>{sub.name}</label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters sidebar */}
        <div className="w-full space-y-6 lg:w-1/4">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              onClick={resetFilters}
              className="text-primary flex items-center gap-2 text-sm hover:underline"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Category filter */}
          <div className="space-y-3">
            <h3 className="font-medium">Categories</h3>
            <RadioGroup
              value={selectedCategory || ""}
              onValueChange={setSelectedCategory}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="" id="all-categories" />
                <label htmlFor="all-categories">All Categories</label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={category.id}
                    id={`cat-${category.id}`}
                  />
                  <label htmlFor={`cat-${category.id}`}>{category.name}</label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Attributes filters */}
          {attributes.map((attribute) => (
            <div key={attribute.id} className="space-y-3">
              <h3 className="font-medium">{attribute.name}</h3>
              {renderFilterForAttribute(attribute)}
            </div>
          ))}
        </div>

        {/* Products grid */}
        <div className="w-full lg:w-3/4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </h2>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ShopCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-lg font-medium">No products found</p>
              <button
                onClick={resetFilters}
                className="text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilterClient;
