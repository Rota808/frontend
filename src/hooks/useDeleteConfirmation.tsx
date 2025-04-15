
import { useState } from 'react';

type ItemType = 'pizza' | 'price' | 'size' | 'store' | 'beverage';

interface DeleteItem {
  id: number;
  type: ItemType;
}

export const useDeleteConfirmation = () => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);

  const openDeleteDialog = (id: number, type: ItemType) => {
    setItemToDelete({ id, type });
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  return {
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    itemToDelete,
    setItemToDelete,
    openDeleteDialog,
    closeDeleteDialog
  };
};
