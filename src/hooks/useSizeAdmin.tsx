
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Size, SizeInput } from '@/services/api';
import { toast } from '@/components/ui/sonner';

export const useSizeAdmin = () => {
  const queryClient = useQueryClient();
  const [isAddSizeOpen, setIsAddSizeOpen] = useState(false);
  const [isEditSizeOpen, setIsEditSizeOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  
  const { 
    data: sizes = [], 
    isLoading: isSizesLoading 
  } = useQuery({
    queryKey: ['sizes'],
    queryFn: apiService.getSizes,
  });

  const createSizeMutation = useMutation({
    mutationFn: apiService.createSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast.success('Tamanho adicionado com sucesso!');
      setIsAddSizeOpen(false);
    },
    onError: (error) => {
      toast.error('Falha ao adicionar tamanho');
      console.error('Erro ao criar tamanho:', error);
    }
  });

  const updateSizeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SizeInput }) => 
      apiService.updateSize(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast.success('Tamanho atualizado com sucesso!');
      setIsEditSizeOpen(false);
      setSelectedSize(null);
    },
    onError: (error) => {
      toast.error('Falha ao atualizar tamanho');
      console.error('Erro ao atualizar tamanho:', error);
    }
  });

  const deleteSizeMutation = useMutation({
    mutationFn: apiService.deleteSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast.success('Tamanho excluído com sucesso!');
    },
    onError: (error) => {
      toast.error('Falha ao excluir tamanho');
      console.error('Erro ao excluir tamanho:', error);
    }
  });

  const handleAddSize = async (data: SizeInput) => {
    await createSizeMutation.mutateAsync(data);
  };

  const handleEditSize = async (data: SizeInput) => {
    if (selectedSize) {
      await updateSizeMutation.mutateAsync({ id: selectedSize.id, data });
    }
  };

  const handleDeleteSize = (id: number) => {
    return id; // Return the ID to be used by the delete confirmation dialog
  };

  const confirmDeleteSize = (id: number) => {
    deleteSizeMutation.mutate(id);
  };

  return {
    sizes,
    isSizesLoading,
    isAddSizeOpen,
    setIsAddSizeOpen,
    isEditSizeOpen,
    setIsEditSizeOpen,
    selectedSize,
    setSelectedSize,
    handleAddSize,
    handleEditSize,
    handleDeleteSize,
    confirmDeleteSize,
    createSizeMutation,
    updateSizeMutation
  };
};
