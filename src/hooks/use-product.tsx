import getAttributes from "@/actions/get-attributes";
import getProduct from "@/actions/get-product";
import getSubAttributes from "@/actions/get-sub-attributes";
import {
  Product,
  ProductAttribute,
  ProductAttributeAssignment,
  ProductSubAttribute,
  ProductSubAttributeAssignment,
} from "@/types";

async function getMappedProduct(slug: string): Promise<Product | null> {
  try {
    const [product, attributes, subAttributes] = await Promise.all([
      getProduct(slug),
      getAttributes(),
      getSubAttributes(),
    ]);

    if (!product) return null;

    const subAttributesByAttributeId = subAttributes.reduce(
      (acc, subAttr) => {
        if (!acc[subAttr.productAttributeId]) {
          acc[subAttr.productAttributeId] = [];
        }
        acc[subAttr.productAttributeId].push(subAttr);
        return acc;
      },
      {} as Record<string, ProductSubAttribute[]>,
    );

    // Mapear variações
    const variations = product.variations.map((variation) => {
      const mappedAttributes = variation.attributes.map((attr) => {
        const attribute = attributes.find((a) => a.id === attr.attributeId);

        const mappedSubAttributes: ProductSubAttributeAssignment[] =
          attr.subAttributes.map((subAttr) => {
            const fullSubAttr = subAttributes.find(
              (sa) => sa.id === subAttr.subAttributeId,
            );
            return {
              id: subAttr.id,
              subAttributeId: subAttr.subAttributeId,
              subAttributeName: subAttr.subAttributeName,
              value: fullSubAttr?.value || "",
            };
          });

        return {
          id: attr.id,
          attributeId: attr.attributeId,
          attributeName: attr.attributeName,
          type: attribute?.type || "DEFAULT",
          productPageType: attribute?.productPageType || "DEFAULT",
          filterPageType: attribute?.filterPageType || "DEFAULT",
          subAttributes: mappedSubAttributes,
        } as ProductAttributeAssignment;
      });

      return {
        ...variation,
        attributes: mappedAttributes,
      };
    });

    // Mapear atributos do produto
    const productAttributes = attributes
      .filter((attr) =>
        product.variations.some((v) =>
          v.attributes.some((a) => a.attributeId === attr.id),
        ),
      )
      .map(
        (attr): ProductAttribute => ({
          id: attr.id,
          name: attr.name,
          slug: attr.slug,
          type: attr.type,
          productPageType: attr.productPageType,
          filterPageType: attr.filterPageType,
          productSubAttributes: subAttributesByAttributeId[attr.id] || [],
          createdAt: attr.createdAt,
          updatedAt: attr.updatedAt,
        }),
      );

    return {
      ...product,
      variations,
      attributes: productAttributes,
    } as Product;
  } catch (error) {
    console.error(`Error mapping product with slug ${slug}:`, error);
    return null;
  }
}

export default getMappedProduct;
