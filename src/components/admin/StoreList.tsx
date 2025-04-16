
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { StoreInfo } from '@/services/api';

interface StoreListProps {
  stores: StoreInfo[];
  onEdit: (store: StoreInfo) => void;
  onDelete: (id: number) => void;
}

const StoreList: React.FC<StoreListProps> = ({ stores, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {stores.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          Nenhuma loja cadastrada
        </p>
      ) : (
        stores.map((store) => (
          <div
            key={store.id}
            className="flex flex-col border rounded-lg overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-muted/50 p-4 flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                  <p className="text-sm mt-1">{store.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
                  <p className="text-sm mt-1">{store.contact_phone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Instruções</h3>
                <p className="text-sm mt-1">{store.directions}</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="border-t p-4 bg-background flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(store)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(store.id)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StoreList;
