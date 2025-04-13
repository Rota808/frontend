
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePizzaAdmin } from '@/hooks/usePizzaAdmin';
import { usePriceAdmin } from '@/hooks/usePriceAdmin';
import { useSizeAdmin } from '@/hooks/useSizeAdmin';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import PizzaSection from '@/components/admin/PizzaSection';
import PriceSection from '@/components/admin/PriceSection';
import SizeSection from '@/components/admin/SizeSection';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

const AdminPage: React.FC = () => {
  // Hooks for each admin section
  const pizzaAdmin = usePizzaAdmin();
  const priceAdmin = usePriceAdmin();
  const sizeAdmin = useSizeAdmin();
  
  // Delete confirmation management
  const deleteConfirmation = useDeleteConfirmation();
  
  // Handle delete requests for each type
  const handleDeletePizza = (id: number) => {
    deleteConfirmation.openDeleteDialog(id, 'pizza');
  };

  const handleDeletePrice = (id: number) => {
    deleteConfirmation.openDeleteDialog(id, 'price');
  };

  const handleDeleteSize = (id: number) => {
    deleteConfirmation.openDeleteDialog(id, 'size');
  };

  // Handle confirmation of deletion
  const handleConfirmDelete = () => {
    if (!deleteConfirmation.itemToDelete) return;
    
    const { id, type } = deleteConfirmation.itemToDelete;
    
    if (type === 'pizza') {
      pizzaAdmin.confirmDeletePizza(id);
    } else if (type === 'price') {
      priceAdmin.confirmDeletePrice(id);
    } else if (type === 'size') {
      sizeAdmin.confirmDeleteSize(id);
    }
    
    deleteConfirmation.closeDeleteDialog();
  };

  // Check if any data is still loading
  const isLoading = pizzaAdmin.isPizzasLoading || priceAdmin.isPricesLoading || sizeAdmin.isSizesLoading;

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
          <PizzaSection
            pizzas={pizzaAdmin.pizzas}
            pizzaPrices={priceAdmin.pizzaPrices}
            isLoading={isLoading}
            isAddOpen={pizzaAdmin.isAddPizzaOpen}
            setIsAddOpen={pizzaAdmin.setIsAddPizzaOpen}
            isEditOpen={pizzaAdmin.isEditPizzaOpen}
            setIsEditOpen={pizzaAdmin.setIsEditPizzaOpen}
            selectedPizza={pizzaAdmin.selectedPizza}
            setSelectedPizza={pizzaAdmin.setSelectedPizza}
            onAdd={pizzaAdmin.handleAddPizza}
            onEdit={pizzaAdmin.handleEditPizza}
            onDelete={handleDeletePizza}
            isSubmittingAdd={pizzaAdmin.createPizzaMutation.isPending}
            isSubmittingEdit={pizzaAdmin.updatePizzaMutation.isPending}
          />
        </TabsContent>
        
        <TabsContent value="prices">
          <PriceSection
            pizzaPrices={priceAdmin.pizzaPrices}
            pizzas={pizzaAdmin.pizzas}
            sizes={sizeAdmin.sizes}
            isLoading={isLoading}
            isAddOpen={priceAdmin.isAddPriceOpen}
            setIsAddOpen={priceAdmin.setIsAddPriceOpen}
            isEditOpen={priceAdmin.isEditPriceOpen}
            setIsEditOpen={priceAdmin.setIsEditPriceOpen}
            selectedPrice={priceAdmin.selectedPrice}
            setSelectedPrice={priceAdmin.setSelectedPrice}
            onAdd={priceAdmin.handleAddPrice}
            onEdit={priceAdmin.handleEditPrice}
            onDelete={handleDeletePrice}
            isSubmittingAdd={priceAdmin.createPriceMutation.isPending}
            isSubmittingEdit={priceAdmin.updatePriceMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="sizes">
          <SizeSection
            sizes={sizeAdmin.sizes}
            isLoading={isLoading}
            isAddOpen={sizeAdmin.isAddSizeOpen}
            setIsAddOpen={sizeAdmin.setIsAddSizeOpen}
            isEditOpen={sizeAdmin.isEditSizeOpen}
            setIsEditOpen={sizeAdmin.setIsEditSizeOpen}
            selectedSize={sizeAdmin.selectedSize}
            setSelectedSize={sizeAdmin.setSelectedSize}
            onAdd={sizeAdmin.handleAddSize}
            onEdit={sizeAdmin.handleEditSize}
            onDelete={handleDeleteSize}
            isSubmittingAdd={sizeAdmin.createSizeMutation.isPending}
            isSubmittingEdit={sizeAdmin.updateSizeMutation.isPending}
          />
        </TabsContent>
      </Tabs>
      
      {/* Common Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isDeleteConfirmOpen}
        onOpenChange={deleteConfirmation.setIsDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        itemType={deleteConfirmation.itemToDelete?.type || null}
      />
    </div>
  );
};

export default AdminPage;
