
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Pizza, PizzaInput } from '@/services/api';
import { toast } from '@/components/ui/sonner';

export const usePizzaAdmin = () => {
  const queryClient = useQueryClient();
  const [isAddPizzaOpen, setIsAddPizzaOpen] = useState(false);
  const [isEditPizzaOpen, setIsEditPizzaOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  
  const { 
    data: pizzas = [], 
    isLoading: isPizzasLoading 
  } = useQuery({
    queryKey: ['pizzas'],
    queryFn: apiService.getPizzas,
  });

  const createPizzaMutation = useMutation({
    mutationFn: apiService.createPizza,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      toast.success('Pizza adicionada com sucesso!');
      setIsAddPizzaOpen(false);
    },
    onError: (error) => {
      toast.error('Falha ao adicionar pizza');
      console.error('Erro ao criar pizza:', error);
    }
  });

  const updatePizzaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PizzaInput }) => 
      apiService.updatePizza(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      toast.success('Pizza atualizada com sucesso!');
      setIsEditPizzaOpen(false);
      setSelectedPizza(null);
    },
    onError: (error) => {
      toast.error('Falha ao atualizar pizza');
      console.error('Erro ao atualizar pizza:', error);
    }
  });

  const deletePizzaMutation = useMutation({
    mutationFn: apiService.deletePizza,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      toast.success('Pizza excluída com sucesso!');
    },
    onError: (error) => {
      toast.error('Falha ao excluir pizza');
      console.error('Erro ao excluir pizza:', error);
    }
  });

  const handleAddPizza = async (data: PizzaInput) => {
    await createPizzaMutation.mutateAsync(data);
  };

  const handleEditPizza = async (data: PizzaInput) => {
    if (selectedPizza) {
      await updatePizzaMutation.mutateAsync({ id: selectedPizza.id, data });
    }
  };

  const handleDeletePizza = (id: number) => {
    return id; // Return the ID to be used by the delete confirmation dialog
  };

  const confirmDeletePizza = (id: number) => {
    deletePizzaMutation.mutate(id);
  };

  return {
    pizzas,
    isPizzasLoading,
    isAddPizzaOpen,
    setIsAddPizzaOpen,
    isEditPizzaOpen,
    setIsEditPizzaOpen,
    selectedPizza,
    setSelectedPizza,
    handleAddPizza,
    handleEditPizza,
    handleDeletePizza,
    confirmDeletePizza,
    createPizzaMutation,
    updatePizzaMutation
  };
};
