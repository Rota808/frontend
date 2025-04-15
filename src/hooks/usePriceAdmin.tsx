
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, PizzaPrice, PizzaPriceInput } from '@/services/api';
import { toast } from '@/components/ui/sonner';

export const usePriceAdmin = () => {
  const queryClient = useQueryClient();
  const [isAddPriceOpen, setIsAddPriceOpen] = useState(false);
  const [isEditPriceOpen, setIsEditPriceOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PizzaPrice | null>(null);
  
  const { 
    data: pizzaPrices = [], 
    isLoading: isPricesLoading 
  } = useQuery({
    queryKey: ['pizzaPrices'],
    queryFn: apiService.getPizzaPrices,
  });

  const createPriceMutation = useMutation({
    mutationFn: apiService.createPizzaPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzaPrices'] });
      toast.success('Preço adicionado com sucesso!');
      setIsAddPriceOpen(false);
    },
    onError: (error) => {
      toast.error('Falha ao adicionar preço');
      console.error('Erro ao criar preço:', error);
    }
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PizzaPriceInput }) => 
      apiService.updatePizzaPrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzaPrices'] });
      toast.success('Preço atualizado com sucesso!');
      setIsEditPriceOpen(false);
      setSelectedPrice(null);
    },
    onError: (error) => {
      toast.error('Falha ao atualizar preço');
      console.error('Erro ao atualizar preço:', error);
    }
  });

  const deletePriceMutation = useMutation({
    mutationFn: apiService.deletePizzaPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzaPrices'] });
      toast.success('Preço excluído com sucesso!');
    },
    onError: (error) => {
      toast.error('Falha ao excluir preço');
      console.error('Erro ao excluir preço:', error);
    }
  });

  const handleAddPrice = async (data: PizzaPriceInput) => {
    await createPriceMutation.mutateAsync(data);
  };

  const handleEditPrice = async (data: PizzaPriceInput) => {
    if (selectedPrice) {
      await updatePriceMutation.mutateAsync({ id: selectedPrice.id, data });
    }
  };

  const handleDeletePrice = (id: number) => {
    return id; // Return the ID to be used by the delete confirmation dialog
  };

  const confirmDeletePrice = (id: number) => {
    deletePriceMutation.mutate(id);
  };

  return {
    pizzaPrices,
    isPricesLoading,
    isAddPriceOpen,
    setIsAddPriceOpen,
    isEditPriceOpen,
    setIsEditPriceOpen,
    selectedPrice,
    setSelectedPrice,
    handleAddPrice,
    handleEditPrice,
    handleDeletePrice,
    confirmDeletePrice,
    createPriceMutation,
    updatePriceMutation
  };
};
