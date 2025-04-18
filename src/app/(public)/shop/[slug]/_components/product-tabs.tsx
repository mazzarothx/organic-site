import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductTabsProps {
  description: string;
}

export const ProductTabs = ({ description }: ProductTabsProps) => (
  <div className="w-full">
    <Tabs defaultValue="description">
      <TabsList className="mb-10">
        <TabsTrigger value="description">Descrição</TabsTrigger>
        <TabsTrigger value="reviews">Avaliações</TabsTrigger>
      </TabsList>
      <TabsContent value="description">{description}</TabsContent>
      <TabsContent value="reviews">
        Seção de avaliações dos clientes.
      </TabsContent>
    </Tabs>
  </div>
);
