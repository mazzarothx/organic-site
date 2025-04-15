// components/ProductDetailCard.tsx
import { Product, ProductAttribute } from "@/types";
import Image from "next/legacy/image";

interface ProductDetailCardProps {
  product: Product;
  attributes: ProductAttribute[]; // Lista de atributos passada como prop
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  product,
  attributes,
}) => {
  // Função para agrupar subatributos por nome do atributo, sem repetições
  const groupSubAttributesByAttributeName = () => {
    const grouped: { [key: string]: { name: string; value: string }[] } = {};

    product.variations.forEach((variation) => {
      variation.subAttributes?.forEach((subAttribute) => {
        // Encontra o atributo correspondente ao subatributo
        const attribute = attributes.find((attr) =>
          attr.productSubAttributes.some(
            (sub) => sub.id === subAttribute.subAttributeId,
          ),
        );

        const attributeName = attribute?.name || "Desconhecido";

        if (!grouped[attributeName]) {
          grouped[attributeName] = [];
        }

        // Encontra o subatributo completo na lista de atributos
        const fullSubAttribute = attribute?.productSubAttributes.find(
          (sub) => sub.id === subAttribute.subAttributeId,
        );

        if (fullSubAttribute) {
          // Verifica se o subatributo já foi adicionado ao grupo
          const isAlreadyAdded = grouped[attributeName].some(
            (sub) =>
              sub.name === fullSubAttribute.name &&
              sub.value === fullSubAttribute.value,
          );

          // Adiciona apenas se não estiver duplicado
          if (!isAlreadyAdded) {
            grouped[attributeName].push({
              name: fullSubAttribute.name,
              value: fullSubAttribute.value,
            });
          }
        }
      });
    });

    return grouped;
  };

  const groupedSubAttributes = groupSubAttributesByAttributeName();

  return (
    <div className="bg-background flex h-full w-96 flex-col rounded-xl border p-4">
      <div className="relative flex aspect-square w-full rounded-t-xl">
        <Image
          className="rounded-t-md object-cover"
          src={product.images.cover.secureUrl}
          alt={product.name}
          layout="fill"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-sm text-gray-600">{product.description}</p>

        <div className="mt-2">
          <h3 className="font-semibold">Subatributos:</h3>
          {Object.entries(groupedSubAttributes).map(
            ([attributeName, subAttributes]) => (
              <div key={attributeName} className="mt-1">
                <p>
                  <strong>{attributeName}:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {subAttributes.map((subAttribute, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {attributeName.toLowerCase() === "cor" ? (
                        // Exibe uma bolinha colorida para subatributos de "cor"
                        <div
                          className="h-5 w-5 rounded-full border"
                          style={{ backgroundColor: subAttribute.value }}
                        />
                      ) : (
                        // Exibe o nome e o valor para outros atributos
                        <span>
                          {subAttribute.name} - {subAttribute.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-2">
          <h3 className="font-semibold">Propriedades:</h3>
          <p>
            <strong>Quantidade Mínima:</strong> {product.properties.minQuantity}
          </p>
          <p>
            <strong>Multiplicador de Quantidade:</strong>{" "}
            {product.properties.multiQuantity}
          </p>
        </div>

        <div className="mt-2">
          <h3 className="font-semibold">Categoria:</h3>
          <p>{product.categoryId}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCard;
