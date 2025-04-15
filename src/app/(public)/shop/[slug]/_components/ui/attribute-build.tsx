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
  // Filtra os subatributos pertencentes a este atributo
  const filteredSubAttributes = subAttributes.filter(
    (sub) => sub.productAttributeId === attribute.id,
  );

  // Verifica se um subatributo está disponível nas variações ativas
  const isSubAttributeAvailable = (subAttributeId: string) => {
    // Se não há seleções, verifica se existe alguma variação com este subatributo
    if (selectedSubAttributes.length === 0) {
      return variations.some((variation) =>
        variation.attributes.some((attr) =>
          attr.subAttributes.some(
            (sub) =>
              sub.subAttributeId === subAttributeId && variation.quantity > 0,
          ),
        ),
      );
    }

    // Verifica combinações com os subatributos já selecionados
    return variations.some((variation) => {
      // Verifica se todos os subatributos selecionados estão presentes
      const hasAllSelected = selectedSubAttributes.every((selected) =>
        variation.attributes.some((attr) =>
          attr.subAttributes.some(
            (sub) => sub.subAttributeId === selected.value,
          ),
        ),
      );

      // Verifica se a variação contém o subatributo que estamos verificando
      const hasCurrentSubAttr = variation.attributes.some((attr) =>
        attr.subAttributes.some((sub) => sub.subAttributeId === subAttributeId),
      );

      // Verifica se tem estoque
      const hasStock = variation.quantity > 0;

      return hasAllSelected && hasCurrentSubAttr && hasStock;
    });
  };

  // Obtém subatributos disponíveis para este atributo
  const availableSubAttributes = filteredSubAttributes.filter((sub) =>
    isSubAttributeAvailable(sub.id),
  );

  // Obtém o valor selecionado para este atributo (se houver)
  const selectedValue = selectedSubAttributes.find(
    (sub) => sub.name === attribute.name,
  )?.value;

  // Determina se deve mostrar como indisponível
  const isAttributeUnavailable = availableSubAttributes.length === 0;

  return (
    <div className="mb-4">
      <div className="flex flex-row items-start justify-between">
        <h3 className="text-sm font-semibold">
          {attribute.name}
          {isAttributeUnavailable && (
            <span className="ml-2 text-xs text-red-500">(Indisponível)</span>
          )}
        </h3>

        {attribute.productPageType === "SELECT" && (
          <Select
            value={selectedValue}
            onValueChange={(value) => onChange(attribute.name, value)}
            disabled={isAttributeUnavailable}
          >
            <SelectTrigger className="h-10 w-36">
              <SelectValue placeholder={`Selecione ${attribute.name}`} />
            </SelectTrigger>
            <SelectContent>
              {filteredSubAttributes.map((sub) => (
                <SelectItem
                  key={sub.id}
                  value={sub.id}
                  disabled={!isSubAttributeAvailable(sub.id)}
                >
                  <div className="flex items-center gap-2">
                    {sub.name}
                    {!isSubAttributeAvailable(sub.id) && (
                      <span className="text-muted-foreground text-xs">
                        (Indisponível)
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {attribute.productPageType === "COLOR" && (
          <TooltipProvider>
            <RadioGroup
              value={selectedValue}
              onValueChange={(value) => onChange(attribute.name, value)}
              className="flex flex-row gap-3"
              disabled={isAttributeUnavailable}
            >
              {filteredSubAttributes.map((sub) => (
                <Tooltip key={sub.id}>
                  <TooltipTrigger asChild>
                    <div>
                      <RadioGroupItem
                        value={sub.id}
                        id={sub.id}
                        disabled={!isSubAttributeAvailable(sub.id)}
                        className={`h-6 w-6 border-none ${!isSubAttributeAvailable(sub.id) ? "opacity-30" : "hover:ring-primary hover:ring-2"}`}
                        style={{
                          backgroundColor: sub.value.startsWith("#")
                            ? sub.value
                            : undefined,
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{sub.name}</p>
                    {!isSubAttributeAvailable(sub.id) && (
                      <p className="text-xs text-red-500">Indisponível</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </RadioGroup>
          </TooltipProvider>
        )}

        {attribute.productPageType === "RATIO" && (
          <RadioGroup
            value={selectedValue}
            onValueChange={(value) => onChange(attribute.name, value)}
            className="flex flex-row gap-3"
            disabled={isAttributeUnavailable}
          >
            {filteredSubAttributes.map((sub) => (
              <div key={sub.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={sub.id}
                  id={sub.id}
                  disabled={!isSubAttributeAvailable(sub.id)}
                  className={`${!isSubAttributeAvailable(sub.id) ? "opacity-50" : ""}`}
                />
                <label
                  htmlFor={sub.id}
                  className={`text-sm ${!isSubAttributeAvailable(sub.id) ? "opacity-50" : ""}`}
                >
                  {sub.name}
                </label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  );
};

export default AttributeBuild;
