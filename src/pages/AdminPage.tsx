
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePizzaAdmin } from '@/hooks/usePizzaAdmin';
import { usePriceAdmin } from '@/hooks/usePriceAdmin';
import { useSizeAdmin } from '@/hooks/useSizeAdmin';
import { useStoreAdmin } from '@/hooks/useStoreAdmin';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import PizzaSection from '@/components/admin/PizzaSection';
import PriceSection from '@/components/admin/PriceSection';
import SizeSection from '@/components/admin/SizeSection';
import StoreSection from '@/components/admin/StoreSection';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

const AdminPage: React.FC = () => {
  // Hooks for each admin section
  const pizzaAdmin = usePizzaAdmin();
  const priceAdmin = usePriceAdmin();
  const sizeAdmin = useSizeAdmin();
  const storeAdmin = useStoreAdmin();
  
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

  const handleDeleteStore = (id: number) => {
    deleteConfirmation.openDeleteDialog(id, 'store');
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
    } else if (type === 'store') {
      storeAdmin.confirmDeleteStore(id);
    }
    
    deleteConfirmation.closeDeleteDialog();
  };

  // Check if any data is still loading
  const isLoading = 
    pizzaAdmin.isPizzasLoading || 
    priceAdmin.isPricesLoading || 
    sizeAdmin.isSizesLoading ||
    storeAdmin.isStoresLoading;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Painel Administrativo</h1>
      
      <Tabs defaultValue="pizzas" className="w-full">
        <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 mb-8">
          <TabsTrigger value="pizzas" className="text-sm sm:text-base">Pizzas</TabsTrigger>
          <TabsTrigger value="prices" className="text-sm sm:text-base">Preços</TabsTrigger>
          <TabsTrigger value="sizes" className="text-sm sm:text-base">Tamanhos</TabsTrigger>
          <TabsTrigger value="stores" className="text-sm sm:text-base">Lojas</TabsTrigger>
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

        <TabsContent value="stores">
          <StoreSection
            stores={storeAdmin.stores}
            isLoading={isLoading}
            isAddOpen={storeAdmin.isAddStoreOpen}
            setIsAddOpen={storeAdmin.setIsAddStoreOpen}
            isEditOpen={storeAdmin.isEditStoreOpen}
            setIsEditOpen={storeAdmin.setIsEditStoreOpen}
            selectedStore={storeAdmin.selectedStore}
            setSelectedStore={storeAdmin.setSelectedStore}
            onAdd={storeAdmin.handleAddStore}
            onEdit={storeAdmin.handleEditStore}
            onDelete={handleDeleteStore}
            isSubmittingAdd={storeAdmin.createStoreMutation.isPending}
            isSubmittingEdit={storeAdmin.updateStoreMutation.isPending}
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
