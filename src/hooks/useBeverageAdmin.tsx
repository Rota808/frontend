import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Beverage } from '@/services/api';
import { toast } from '@/components/ui/sonner';

export interface BeverageInput {
  beverage_name: string;
  description: string;
  price: number;
  image_url?: string; // <-- Adicione esta linha (opcional)
}

export const useBeverageAdmin = () => {
  const queryClient = useQueryClient();
  const [isAddBeverageOpen, setIsAddBeverageOpen] = useState(false);
  const [isEditBeverageOpen, setIsEditBeverageOpen] = useState(false);
  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(null);
  
  const { 
    data: beverages = [], 
    isLoading: isBeveragesLoading 
  } = useQuery({
    queryKey: ['beverages'],
    queryFn: apiService.getBeverages,
  });

  const createBeverageMutation = useMutation({
    mutationFn: apiService.createBeverage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beverages'] });
      toast.success('Bebida adicionada com sucesso!');
      setIsAddBeverageOpen(false);
    },
    onError: (error) => {
      toast.error('Falha ao adicionar bebida');
      console.error('Erro ao criar bebida:', error);
    }
  });

  const updateBeverageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BeverageInput }) => 
      apiService.updateBeverage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beverages'] });
      toast.success('Bebida atualizada com sucesso!');
      setIsEditBeverageOpen(false);
      setSelectedBeverage(null);
    },
    onError: (error) => {
      toast.error('Falha ao atualizar bebida');
      console.error('Erro ao atualizar bebida:', error);
    }
  });

  const deleteBeverageMutation = useMutation({
    mutationFn: apiService.deleteBeverage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beverages'] });
      toast.success('Bebida excluída com sucesso!');
    },
    onError: (error) => {
      toast.error('Falha ao excluir bebida');
      console.error('Erro ao excluir bebida:', error);
    }
  });

  const handleAddBeverage = async (data: BeverageInput) => {
    await createBeverageMutation.mutateAsync(data);
  };

  const handleEditBeverage = async (data: BeverageInput) => {
    if (selectedBeverage) {
      await updateBeverageMutation.mutateAsync({ id: selectedBeverage.id, data });
    }
  };

  const handleDeleteBeverage = (id: number) => {
    return id; // Return the ID to be used by the delete confirmation dialog
  };

  const confirmDeleteBeverage = (id: number) => {
    deleteBeverageMutation.mutate(id);
  };

  return {
    beverages,
    isBeveragesLoading,
    isAddBeverageOpen,
    setIsAddBeverageOpen,
    isEditBeverageOpen,
    setIsEditBeverageOpen,
    selectedBeverage,
    setSelectedBeverage,
    handleAddBeverage,
    handleEditBeverage,
    handleDeleteBeverage,
    confirmDeleteBeverage,
    createBeverageMutation,
    updateBeverageMutation
  };
};