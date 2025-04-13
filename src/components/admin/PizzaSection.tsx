
import React from 'react';
import { Pizza } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PizzaForm from '@/components/PizzaForm';
import PizzaList from '@/components/PizzaList';
import { Plus } from 'lucide-react';

interface PizzaSectionProps {
  pizzas: Pizza[];
  pizzaPrices: any[];
  isLoading: boolean;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  selectedPizza: Pizza | null;
  setSelectedPizza: (pizza: Pizza | null) => void;
  onAdd: (data: any) => Promise<void>;
  onEdit: (data: any) => Promise<void>;
  onDelete: (id: number) => void;
  isSubmittingAdd: boolean;
  isSubmittingEdit: boolean;
}

const PizzaSection: React.FC<PizzaSectionProps> = ({
  pizzas,
  pizzaPrices,
  isLoading,
  isAddOpen,
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  selectedPizza,
  setSelectedPizza,
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
          <Plus className="mr-2 h-4 w-4" /> Adicionar Nova Pizza
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Carregando pizzas...</div>
      ) : (
        <PizzaList 
          pizzas={pizzas} 
          pizzaPrices={pizzaPrices}
          onEdit={(pizza) => {
            setSelectedPizza(pizza);
            setIsEditOpen(true);
          }}
          onDelete={onDelete}
        />
      )}

      {/* Add Pizza Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Pizza</DialogTitle>
          </DialogHeader>
          <PizzaForm 
            onSubmit={onAdd} 
            isSubmitting={isSubmittingAdd}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Pizza Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pizza</DialogTitle>
          </DialogHeader>
          {selectedPizza && (
            <PizzaForm 
              defaultValues={selectedPizza}
              onSubmit={onEdit} 
              isSubmitting={isSubmittingEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PizzaSection;
