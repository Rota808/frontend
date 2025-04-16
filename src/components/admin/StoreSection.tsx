
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { StoreInfo } from '@/services/api';
import StoreForm from './StoreForm';
import StoreList from './StoreList';

interface StoreSectionProps {
  stores: StoreInfo[];
  isLoading: boolean;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  selectedStore: StoreInfo | null;
  setSelectedStore: (store: StoreInfo | null) => void;
  onAdd: (data: Omit<StoreInfo, 'id'>) => void;
  onEdit: (data: Omit<StoreInfo, 'id'>) => void;
  onDelete: (id: number) => void;
  isSubmittingAdd: boolean;
  isSubmittingEdit: boolean;
}

const StoreSection: React.FC<StoreSectionProps> = ({
  stores,
  isLoading,
  isAddOpen,
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  selectedStore,
  setSelectedStore,
  onAdd,
  onEdit,
  onDelete,
  isSubmittingAdd,
  isSubmittingEdit,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Nova Loja
        </Button>
      </div>
      
      <Card className="p-4 md:p-6">
        <StoreList
          stores={stores}
          onEdit={(store) => {
            setSelectedStore(store);
            setIsEditOpen(true);
          }}
          onDelete={onDelete}
        />
      </Card>

      <StoreForm
        mode="add"
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={onAdd}
        isSubmitting={isSubmittingAdd}
      />

      <StoreForm
        mode="edit"
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={onEdit}
        initialData={selectedStore}
        isSubmitting={isSubmittingEdit}
      />
    </>
  );
};

export default StoreSection;
