
import React from 'react';
import { Size } from '@/services/api';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';

interface SizeListProps {
  sizes: Size[];
  onEdit: (size: Size) => void;
  onDelete: (id: number) => void;
}

const SizeList: React.FC<SizeListProps> = ({ 
  sizes,
  onEdit, 
  onDelete 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tamanhos Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Diâmetro (cm)</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhum tamanho encontrado
                </TableCell>
              </TableRow>
            ) : (
              sizes.map((size) => (
                <TableRow key={size.id}>
                  <TableCell className="font-medium">{size.size_name}</TableCell>
                  <TableCell>{size.diameter}</TableCell>
                  <TableCell className="max-w-xs truncate">{size.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => onEdit(size)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => onDelete(size.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SizeList;
