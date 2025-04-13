
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiService, 
  Pizza, 
  PizzaInput, 
  PizzaPrice, 
  PizzaPriceInput,
  Size,
  SizeInput
} from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/sonner';
import PizzaForm from '@/components/PizzaForm';
import PizzaList from '@/components/PizzaList';
import PizzaPriceForm from '@/components/PizzaPriceForm';
import PizzaPriceList from '@/components/PizzaPriceList';
import SizeForm from '@/components/SizeForm';
import SizeList from '@/components/SizeList';
import { Plus } from 'lucide-react';

const AdminPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State for modals
  const [isAddPizzaOpen, setIsAddPizzaOpen] = useState(false);
  const [isEditPizzaOpen, setIsEditPizzaOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  
  const [isAddPriceOpen, setIsAddPriceOpen] = useState(false);
  const [isEditPriceOpen, setIsEditPriceOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PizzaPrice | null>(null);
  
  const [isAddSizeOpen, setIsAddSizeOpen] = useState(false);
  const [isEditSizeOpen, setIsEditSizeOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: 'pizza' | 'price' | 'size' } | null>(null);

  // Fetch pizzas, sizes, and pizza prices
  const { 
    data: pizzas = [], 
    isLoading: isPizzasLoading 
  } = useQuery({
    queryKey: ['pizzas'],
    queryFn: apiService.getPizzas,
  });

  const { 
    data: sizes = [], 
    isLoading: isSizesLoading 
  } = useQuery({
    queryKey: ['sizes'],
    queryFn: apiService.getSizes,
  });

  const { 
    data: pizzaPrices = [], 
    isLoading: isPricesLoading 
  } = useQuery({
    queryKey: ['pizzaPrices'],
    queryFn: apiService.getPizzaPrices,
  });

  // Mutations for Pizza
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
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast.error('Falha ao excluir pizza');
      console.error('Erro ao excluir pizza:', error);
    }
  });

  // Mutations for Pizza Price
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
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast.error('Falha ao excluir preço');
      console.error('Erro ao excluir preço:', error);
    }
  });

  // Mutations for Size
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
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast.error('Falha ao excluir tamanho');
      console.error('Erro ao excluir tamanho:', error);
    }
  });

  // Handlers for Pizza
  const handleAddPizza = async (data: PizzaInput) => {
    await createPizzaMutation.mutateAsync(data);
  };

  const handleEditPizza = async (data: PizzaInput) => {
    if (selectedPizza) {
      await updatePizzaMutation.mutateAsync({ id: selectedPizza.id, data });
    }
  };

  const handleDeletePizza = (id: number) => {
    setItemToDelete({ id, type: 'pizza' });
    setIsDeleteConfirmOpen(true);
  };

  // Handlers for Price
  const handleAddPrice = async (data: PizzaPriceInput) => {
    await createPriceMutation.mutateAsync(data);
  };

  const handleEditPrice = async (data: PizzaPriceInput) => {
    if (selectedPrice) {
      await updatePriceMutation.mutateAsync({ id: selectedPrice.id, data });
    }
  };

  const handleDeletePrice = (id: number) => {
    setItemToDelete({ id, type: 'price' });
    setIsDeleteConfirmOpen(true);
  };

  // Handlers for Size
  const handleAddSize = async (data: SizeInput) => {
    await createSizeMutation.mutateAsync(data);
  };

  const handleEditSize = async (data: SizeInput) => {
    if (selectedSize) {
      await updateSizeMutation.mutateAsync({ id: selectedSize.id, data });
    }
  };

  const handleDeleteSize = (id: number) => {
    setItemToDelete({ id, type: 'size' });
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'pizza') {
      deletePizzaMutation.mutate(itemToDelete.id);
    } else if (itemToDelete.type === 'price') {
      deletePriceMutation.mutate(itemToDelete.id);
    } else if (itemToDelete.type === 'size') {
      deleteSizeMutation.mutate(itemToDelete.id);
    }
  };

  // Loading state
  const isLoading = isPizzasLoading || isSizesLoading || isPricesLoading;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Painel Administrativo</h1>
      
      <Tabs defaultValue="pizzas">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="pizzas">Gerenciar Pizzas</TabsTrigger>
          <TabsTrigger value="prices">Gerenciar Preços</TabsTrigger>
          <TabsTrigger value="sizes">Gerenciar Tamanhos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pizzas">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddPizzaOpen(true)}>
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
                setIsEditPizzaOpen(true);
              }}
              onDelete={handleDeletePizza}
            />
          )}
        </TabsContent>
        
        <TabsContent value="prices">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddPriceOpen(true)}>
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
                setIsEditPriceOpen(true);
              }}
              onDelete={handleDeletePrice}
            />
          )}
        </TabsContent>

        <TabsContent value="sizes">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddSizeOpen(true)}>
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
                setIsEditSizeOpen(true);
              }}
              onDelete={handleDeleteSize}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Pizza Dialog */}
      <Dialog open={isAddPizzaOpen} onOpenChange={setIsAddPizzaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Pizza</DialogTitle>
          </DialogHeader>
          <PizzaForm 
            onSubmit={handleAddPizza} 
            isSubmitting={createPizzaMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Pizza Dialog */}
      <Dialog open={isEditPizzaOpen} onOpenChange={setIsEditPizzaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pizza</DialogTitle>
          </DialogHeader>
          {selectedPizza && (
            <PizzaForm 
              defaultValues={selectedPizza}
              onSubmit={handleEditPizza} 
              isSubmitting={updatePizzaMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Price Dialog */}
      <Dialog open={isAddPriceOpen} onOpenChange={setIsAddPriceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Preço</DialogTitle>
          </DialogHeader>
          <PizzaPriceForm
            pizzas={pizzas}
            sizes={sizes}
            onSubmit={handleAddPrice}
            isSubmitting={createPriceMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Price Dialog */}
      <Dialog open={isEditPriceOpen} onOpenChange={setIsEditPriceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Preço</DialogTitle>
          </DialogHeader>
          {selectedPrice && (
            <PizzaPriceForm
              pizzas={pizzas}
              sizes={sizes}
              defaultValues={selectedPrice}
              onSubmit={handleEditPrice}
              isSubmitting={updatePriceMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Size Dialog */}
      <Dialog open={isAddSizeOpen} onOpenChange={setIsAddSizeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Tamanho</DialogTitle>
          </DialogHeader>
          <SizeForm
            onSubmit={handleAddSize}
            isSubmitting={createSizeMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Size Dialog */}
      <Dialog open={isEditSizeOpen} onOpenChange={setIsEditSizeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tamanho</DialogTitle>
          </DialogHeader>
          {selectedSize && (
            <SizeForm
              defaultValues={selectedSize}
              onSubmit={handleEditSize}
              isSubmitting={updateSizeMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente 
              {itemToDelete?.type === 'pizza' ? ' a pizza' : 
                itemToDelete?.type === 'price' ? ' o preço' : ' o tamanho'} 
              do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
