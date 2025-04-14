
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
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
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Lojas</h2>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Loja
          </Button>
        </div>

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
    </div>
  );
};

export default StoreSection;
