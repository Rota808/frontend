import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, StoreInfo } from "@/services/api";
import { toast } from "@/components/ui/sonner";

export const useStoreAdmin = () => {
  const queryClient = useQueryClient();
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isEditStoreOpen, setIsEditStoreOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);

  const { data: stores = [], isLoading: isStoresLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: apiService.getStoreInfo,
  });

  const createStoreMutation = useMutation({
    mutationFn: (data: Omit<StoreInfo, "id">) =>
      fetch(
        "https://es2back-f9bra3hfdua8cfa7.francecentral-01.azurewebsites.net/store-info/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      ).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Loja adicionada com sucesso!");
      setIsAddStoreOpen(false);
    },
    onError: (error) => {
      toast.error("Falha ao adicionar loja");
      console.error("Error creating store:", error);
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<StoreInfo, "id"> }) =>
      fetch(
        `https://es2back-f9bra3hfdua8cfa7.francecentral-01.azurewebsites.net/store-info/${id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      ).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Loja atualizada com sucesso!");
      setIsEditStoreOpen(false);
      setSelectedStore(null);
    },
    onError: (error) => {
      toast.error("Falha ao atualizar loja");
      console.error("Error updating store:", error);
    },
  });

  const deleteStoreMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(
        `https://es2back-f9bra3hfdua8cfa7.francecentral-01.azurewebsites.net/store-info/${id}/`,
        {
          method: "DELETE",
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Loja excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Falha ao excluir loja");
      console.error("Error deleting store:", error);
    },
  });

  const handleAddStore = async (data: Omit<StoreInfo, "id">) => {
    await createStoreMutation.mutateAsync(data);
  };

  const handleEditStore = async (data: Omit<StoreInfo, "id">) => {
    if (selectedStore) {
      await updateStoreMutation.mutateAsync({ id: selectedStore.id, data });
    }
  };

  const handleDeleteStore = (id: number) => {
    return id;
  };

  const confirmDeleteStore = (id: number) => {
    deleteStoreMutation.mutate(id);
  };

  return {
    stores,
    isStoresLoading,
    isAddStoreOpen,
    setIsAddStoreOpen,
    isEditStoreOpen,
    setIsEditStoreOpen,
    selectedStore,
    setSelectedStore,
    handleAddStore,
    handleEditStore,
    handleDeleteStore,
    confirmDeleteStore,
    createStoreMutation,
    updateStoreMutation,
  };
};
