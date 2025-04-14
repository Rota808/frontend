
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
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg"
          >
            <div className="space-y-2 flex-1">
              <div>
                <h3 className="font-medium">Endereço:</h3>
                <p className="text-sm text-muted-foreground">{store.address}</p>
              </div>
              <div>
                <h3 className="font-medium">Telefone:</h3>
                <p className="text-sm text-muted-foreground">{store.contact_phone}</p>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => onEdit(store)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 sm:flex-none"
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
