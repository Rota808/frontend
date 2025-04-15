import React from 'react';
import { Beverage } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BeverageForm from '@/components/BeverageForm';
import BeverageList from '@/components/BeverageList';
import { Plus } from 'lucide-react';
import { BeverageInput } from '@/hooks/useBeverageAdmin';

interface BeverageSectionProps {
  beverages: Beverage[];
  isLoading: boolean;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  selectedBeverage: Beverage | null;
  setSelectedBeverage: (beverage: Beverage | null) => void;
  onAdd: (data: BeverageInput) => Promise<void>;
  onEdit: (data: BeverageInput) => Promise<void>;
  onDelete: (id: number) => void;
  isSubmittingAdd: boolean;
  isSubmittingEdit: boolean;
}

const BeverageSection: React.FC<BeverageSectionProps> = ({
  beverages,
  isLoading,
  isAddOpen,
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  selectedBeverage,
  setSelectedBeverage,
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
          <Plus className="mr-2 h-4 w-4" /> Adicionar Nova Bebida
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Carregando bebidas...</div>
      ) : (
        <BeverageList 
          beverages={beverages}
          onEdit={(beverage) => {
            setSelectedBeverage(beverage);
            setIsEditOpen(true);
          }}
          onDelete={onDelete}
        />
      )}

      {/* Add Beverage Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Bebida</DialogTitle>
          </DialogHeader>
          <BeverageForm 
            onSubmit={onAdd} 
            isSubmitting={isSubmittingAdd}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Beverage Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Bebida</DialogTitle>
          </DialogHeader>
          {selectedBeverage && (
            <BeverageForm 
              defaultValues={{
                beverage_name: selectedBeverage.beverage_name,
                description: selectedBeverage.description,
                price: selectedBeverage.price
              }}
              onSubmit={onEdit} 
              isSubmitting={isSubmittingEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BeverageSection;