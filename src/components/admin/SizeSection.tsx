
import React from 'react';
import { Size } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SizeForm from '@/components/SizeForm';
import SizeList from '@/components/SizeList';
import { Plus } from 'lucide-react';

interface SizeSectionProps {
  sizes: Size[];
  isLoading: boolean;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  selectedSize: Size | null;
  setSelectedSize: (size: Size | null) => void;
  onAdd: (data: any) => Promise<void>;
  onEdit: (data: any) => Promise<void>;
  onDelete: (id: number) => void;
  isSubmittingAdd: boolean;
  isSubmittingEdit: boolean;
}

const SizeSection: React.FC<SizeSectionProps> = ({
  sizes,
  isLoading,
  isAddOpen,
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  selectedSize,
  setSelectedSize,
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
          <Plus className="mr-2 h-4 w-4" /> Adicionar Novo Tamanho
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Carregando tamanhos...</div>
      ) : (
        <SizeList 
          sizes={sizes}
          onEdit={(size) => {
            setSelectedSize(size);
            setIsEditOpen(true);
          }}
          onDelete={onDelete}
        />
      )}

      {/* Add Size Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Tamanho</DialogTitle>
          </DialogHeader>
          <SizeForm
            onSubmit={onAdd}
            isSubmitting={isSubmittingAdd}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Size Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tamanho</DialogTitle>
          </DialogHeader>
          {selectedSize && (
            <SizeForm
              defaultValues={selectedSize}
              onSubmit={onEdit}
              isSubmitting={isSubmittingEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SizeSection;
