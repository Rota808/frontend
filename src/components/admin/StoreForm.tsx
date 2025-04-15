
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { StoreInfo } from '@/services/api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const storeFormSchema = z.object({
  address: z.string().min(1, 'Endereço é obrigatório'),
  directions: z.string().min(1, 'Instruções são obrigatórias'),
  contact_phone: z.string().min(1, 'Telefone é obrigatório'),
});

type StoreFormData = z.infer<typeof storeFormSchema>;

interface StoreFormProps {
  mode: 'add' | 'edit';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StoreFormData) => void;
  initialData?: StoreInfo | null;
  isSubmitting?: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({
  mode,
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      address: initialData?.address || '',
      directions: initialData?.directions || '',
      contact_phone: initialData?.contact_phone || '',
    },
  });

  const handleSubmit = (data: StoreFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Adicionar Nova Loja' : 'Editar Loja'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Digite o endereço completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="directions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Como Chegar</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Digite as instruções de como chegar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o telefone de contato" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {mode === 'add' ? 'Adicionar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StoreForm;
