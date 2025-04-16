
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePizzaAdmin } from '@/hooks/usePizzaAdmin';
import { usePriceAdmin } from '@/hooks/usePriceAdmin';
import { useSizeAdmin } from '@/hooks/useSizeAdmin';
import { useStoreAdmin } from '@/hooks/useStoreAdmin';
import { useBeverageAdmin } from '@/hooks/useBeverageAdmin';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import PizzaSection from '@/components/admin/PizzaSection';
import PriceSection from '@/components/admin/PriceSection';
import SizeSection from '@/components/admin/SizeSection';
import StoreSection from '@/components/admin/StoreSection';
import BeverageSection from '@/components/admin/BeverageSection';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminPage: React.FC = () => {
  // Check if viewing on mobile
  const isMobile = useIsMobile();
  
  // Hooks for each admin section
  const pizzaAdmin = usePizzaAdmin();
  const priceAdmin = usePriceAdmin();
  const sizeAdmin = useSizeAdmin();
  const storeAdmin = useStoreAdmin();
  const beverageAdmin = useBeverageAdmin();
  
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
  
  const handleDeleteBeverage = (id: number) => {
    deleteConfirmation.openDeleteDialog(id, 'beverage');
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
    } else if (type === 'beverage') {
      beverageAdmin.confirmDeleteBeverage(id);
    }
    
    deleteConfirmation.closeDeleteDialog();
  };

  // Check if any data is still loading
  const isLoading = 
    pizzaAdmin.isPizzasLoading || 
    priceAdmin.isPricesLoading || 
    sizeAdmin.isSizesLoading ||
    storeAdmin.isStoresLoading ||
    beverageAdmin.isBeveragesLoading;

  return (
    <div className="container py-6 md:py-8 px-3 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Painel Administrativo</h1>
      
      <Tabs defaultValue="pizzas" className="w-full">
        <TabsList className={`w-full mx-auto ${isMobile ? 'flex flex-wrap gap-2' : 'grid grid-cols-5'} mb-6 md:mb-8`}>
          <TabsTrigger value="pizzas" className="px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm">Pizzas</TabsTrigger>
          <TabsTrigger value="prices" className="px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm">Preços</TabsTrigger>
          <TabsTrigger value="sizes" className="px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm">Tamanhos</TabsTrigger>
          <TabsTrigger value="beverages" className="px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm">Bebidas</TabsTrigger>
          <TabsTrigger value="stores" className="px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm">Lojas</TabsTrigger>
        </TabsList>
        
        <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
          <TabsContent value="pizzas" className="mt-0">
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
          
          <TabsContent value="prices" className="mt-0">
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

          <TabsContent value="sizes" className="mt-0">
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
          
          <TabsContent value="beverages" className="mt-0">
            <BeverageSection
              beverages={beverageAdmin.beverages}
              isLoading={isLoading}
              isAddOpen={beverageAdmin.isAddBeverageOpen}
              setIsAddOpen={beverageAdmin.setIsAddBeverageOpen}
              isEditOpen={beverageAdmin.isEditBeverageOpen}
              setIsEditOpen={beverageAdmin.setIsEditBeverageOpen}
              selectedBeverage={beverageAdmin.selectedBeverage}
              setSelectedBeverage={beverageAdmin.setSelectedBeverage}
              onAdd={beverageAdmin.handleAddBeverage}
              onEdit={beverageAdmin.handleEditBeverage}
              onDelete={handleDeleteBeverage}
              isSubmittingAdd={beverageAdmin.createBeverageMutation.isPending}
              isSubmittingEdit={beverageAdmin.updateBeverageMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="stores" className="mt-0">
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
        </div>
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
