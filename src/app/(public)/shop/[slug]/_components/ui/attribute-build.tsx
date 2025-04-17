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
import {
  ProductAttribute,
  ProductSubAttribute,
  ProductVariation,
} from "@/types";

interface AttributeBuildProps {
  attribute: ProductAttribute;
  subAttributes: ProductSubAttribute[];
  onChange: (name: string, value: string) => void;
  variations: ProductVariation[];
  selectedSubAttributes: { name: string; value: string }[];
}

const AttributeBuild = ({
  attribute,
  subAttributes,
  onChange,
  variations,
  selectedSubAttributes,
}: AttributeBuildProps) => {
  // Filtra os subatributos deste atributo específico
  const filteredSubAttributes = subAttributes.filter(
    (sub) => sub.productAttributeId === attribute.id,
  );

  // Encontra o valor atualmente selecionado para este atributo
  const selectedValue = selectedSubAttributes.find(
    (sub) => sub.name === attribute.name,
  )?.value;

  /**
   * Verifica se um subatributo está disponível considerando:
   * 1. Se já está selecionado (sempre disponível para deseleção)
   * 2. Se existe em variações com estoque
   * 3. Se combina com outros atributos selecionados
   */
  const isSubAttributeAvailable = (subAttributeId: string): boolean => {
    // Se já está selecionado, está disponível para permitir troca
    if (selectedValue === subAttributeId) return true;

    // Filtra outros atributos selecionados (excluindo o atual)
    const otherSelections = selectedSubAttributes.filter(
      (sub) => sub.name !== attribute.name,
    );

    // Verifica se existe alguma variação que:
    // 1. Tenha estoque > 0
    // 2. Contenha o subatributo que estamos verificando
    // 3. Contenha todos os outros subatributos selecionados (se houver)
    return variations.some((variation) => {
      // Precisa ter estoque
      if (variation.quantity <= 0) return false;

      // Precisa conter o subatributo que estamos verificando
      const hasCurrentSubAttr = variation.attributes.some((attr) =>
        attr.subAttributes.some((sub) => sub.subAttributeId === subAttributeId),
      );
      if (!hasCurrentSubAttr) return false;

      // Se não há outras seleções, já é válido
      if (otherSelections.length === 0) return true;

      // Precisa conter todos os outros subatributos selecionados
      return otherSelections.every((selected) =>
        variation.attributes.some((attr) =>
          attr.subAttributes.some(
            (sub) => sub.subAttributeId === selected.value,
          ),
        ),
      );
    });
  };

  const handleValueChange = (value: string) => {
    onChange(attribute.name, value);
  };

  // Renderização condicional baseada no tipo de atributo
  switch (attribute.productPageType) {
    case "COLOR":
      return (
        <div className="mb-4">
          <div className="flex flex-row items-start justify-between">
            <h3 className="text-sm font-semibold">{attribute.name}</h3>

            <TooltipProvider>
              <RadioGroup
                value={selectedValue || ""}
                onValueChange={handleValueChange}
                className="flex flex-row gap-3"
              >
                {filteredSubAttributes.map((sub) => {
                  const available = isSubAttributeAvailable(sub.id);
                  return (
                    <Tooltip key={sub.id}>
                      <TooltipTrigger asChild>
                        <div>
                          <RadioGroupItem
                            value={sub.id}
                            id={sub.id}
                            disabled={!available}
                            className={`h-6 w-6 border-none ${
                              !available
                                ? "cursor-not-allowed opacity-30"
                                : "hover:ring-primary hover:ring-2"
                            } ${
                              selectedValue === sub.id
                                ? "ring-primary ring-2"
                                : ""
                            }`}
                            style={{
                              backgroundColor: sub.value.startsWith("#")
                                ? sub.value
                                : "transparent",
                              backgroundImage: !sub.value.startsWith("#")
                                ? `url(${sub.value})`
                                : undefined,
                            }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{sub.name}</p>
                        {!available && (
                          <p className="text-xs text-red-500">Indisponível</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </RadioGroup>
            </TooltipProvider>
          </div>
        </div>
      );

    case "SELECT":
    default:
      return (
        <div className="mb-4">
          <div className="flex flex-row items-start justify-between">
            <h3 className="text-sm font-semibold">{attribute.name}</h3>

            <Select value={selectedValue} onValueChange={handleValueChange}>
              <SelectTrigger className="h-10 w-36">
                <SelectValue placeholder={`Selecione ${attribute.name}`} />
              </SelectTrigger>
              <SelectContent>
                {filteredSubAttributes.map((sub) => {
                  const available = isSubAttributeAvailable(sub.id);
                  return (
                    <SelectItem
                      key={sub.id}
                      value={sub.id}
                      disabled={!available}
                    >
                      <div className="flex items-center gap-2">
                        {sub.name}
                        {!available && (
                          <span className="text-muted-foreground text-xs">
                            (Indisponível)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
  }
};

export default AttributeBuild;
