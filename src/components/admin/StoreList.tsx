
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { StoreInfo } from '@/services/api';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';

interface StoreListProps {
  stores: StoreInfo[];
  onEdit: (store: StoreInfo) => void;
  onDelete: (id: number) => void;
}

const StoreList: React.FC<StoreListProps> = ({ stores, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Endereço</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Instruções</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              Nenhuma loja cadastrada
            </TableCell>
          </TableRow>
        ) : (
          stores.map((store) => (
            <TableRow key={store.id}>
              <TableCell className="font-medium">{store.address}</TableCell>
              <TableCell>{store.contact_phone}</TableCell>
              <TableCell className="max-w-xs truncate">{store.directions}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => onEdit(store)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={() => onDelete(store.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default StoreList;
