
import React from 'react';
import { Pizza, PizzaPrice, Size } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PizzaPriceForm from '@/components/PizzaPriceForm';
import PizzaPriceList from '@/components/PizzaPriceList';
import { Plus } from 'lucide-react';

interface PriceSectionProps {
  pizzaPrices: PizzaPrice[];
  pizzas: Pizza[];
  sizes: Size[];
  isLoading: boolean;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  selectedPrice: PizzaPrice | null;
  setSelectedPrice: (price: PizzaPrice | null) => void;
  onAdd: (data: any) => Promise<void>;
  onEdit: (data: any) => Promise<void>;
  onDelete: (id: number) => void;
  isSubmittingAdd: boolean;
  isSubmittingEdit: boolean;
}

const PriceSection: React.FC<PriceSectionProps> = ({
  pizzaPrices,
  pizzas,
  sizes,
  isLoading,
  isAddOpen,
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  selectedPrice,
  setSelectedPrice,
  onAdd,
  onEdit,
  onDelete,
  isSubmittingAdd,
  isSubmittingEdit
}) => {
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Novo Preço
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Carregando preços...</div>
      ) : (
        <PizzaPriceList 
          pizzaPrices={pizzaPrices}
          pizzas={pizzas}
          sizes={sizes}
          onEdit={(price) => {
            setSelectedPrice(price);
            setIsEditOpen(true);
          }}
          onDelete={onDelete}
        />
      )}

      {/* Add Price Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Preço</DialogTitle>
          </DialogHeader>
          <PizzaPriceForm
            pizzas={pizzas}
            sizes={sizes}
            onSubmit={onAdd}
            isSubmitting={isSubmittingAdd}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Price Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Preço</DialogTitle>
          </DialogHeader>
          {selectedPrice && (
            <PizzaPriceForm
              pizzas={pizzas}
              sizes={sizes}
              defaultValues={selectedPrice}
              onSubmit={onEdit}
              isSubmitting={isSubmittingEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PriceSection;
