
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiService, 
  Pizza, 
  PizzaInput, 
  PizzaPrice, 
  PizzaPriceInput 
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
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: 'pizza' | 'price' } | null>(null);

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

  // Mutations
  const createPizzaMutation = useMutation({
    mutationFn: apiService.createPizza,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      toast.success('Pizza added successfully!');
      setIsAddPizzaOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to add pizza');
      console.error('Error creating pizza:', error);
    }
  });

  const updatePizzaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PizzaInput }) => 
      apiService.updatePizza(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      toast.success('Pizza updated successfully!');
      setIsEditPizzaOpen(false);
      setSelectedPizza(null);
    },
    onError: (error) => {
      toast.error('Failed to update pizza');
      console.error('Error updating pizza:', error);
    }
  });

  const deletePizzaMutation = useMutation({
    mutationFn: apiService.deletePizza,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      toast.success('Pizza deleted successfully!');
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast.error('Failed to delete pizza');
      console.error('Error deleting pizza:', error);
    }
  });

  const createPriceMutation = useMutation({
    mutationFn: apiService.createPizzaPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzaPrices'] });
      toast.success('Price added successfully!');
      setIsAddPriceOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to add price');
      console.error('Error creating price:', error);
    }
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PizzaPriceInput }) => 
      apiService.updatePizzaPrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzaPrices'] });
      toast.success('Price updated successfully!');
      setIsEditPriceOpen(false);
      setSelectedPrice(null);
    },
    onError: (error) => {
      toast.error('Failed to update price');
      console.error('Error updating price:', error);
    }
  });

  const deletePriceMutation = useMutation({
    mutationFn: apiService.deletePizzaPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzaPrices'] });
      toast.success('Price deleted successfully!');
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast.error('Failed to delete price');
      console.error('Error deleting price:', error);
    }
  });

  // Handlers
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

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'pizza') {
      deletePizzaMutation.mutate(itemToDelete.id);
    } else {
      deletePriceMutation.mutate(itemToDelete.id);
    }
  };

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

  // Loading state
  const isLoading = isPizzasLoading || isSizesLoading || isPricesLoading;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      
      <Tabs defaultValue="pizzas">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="pizzas">Manage Pizzas</TabsTrigger>
          <TabsTrigger value="prices">Manage Prices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pizzas">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddPizzaOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Pizza
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading pizzas...</div>
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
              <Plus className="mr-2 h-4 w-4" /> Add New Price
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading prices...</div>
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
      </Tabs>
      
      {/* Add Pizza Dialog */}
      <Dialog open={isAddPizzaOpen} onOpenChange={setIsAddPizzaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Pizza</DialogTitle>
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
            <DialogTitle>Edit Pizza</DialogTitle>
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
            <DialogTitle>Add New Price</DialogTitle>
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
            <DialogTitle>Edit Price</DialogTitle>
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
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              {itemToDelete?.type === 'pizza' ? ' pizza' : ' price'} 
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
