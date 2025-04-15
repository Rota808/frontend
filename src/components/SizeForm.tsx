
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Size } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';

const sizeSchema = z.object({
  size_name: z.string().min(2, {
    message: 'O nome do tamanho deve ter pelo menos 2 caracteres.',
  }),
  diameter: z.coerce.number().min(1, {
    message: 'O diâmetro deve ser maior que 0.',
  }),
  description: z.string().optional(),
});

type SizeInput = Omit<Size, 'id'>;

interface SizeFormProps {
  defaultValues?: SizeInput;
  onSubmit: (data: SizeInput) => Promise<void>;
  isSubmitting: boolean;
}

const SizeForm: React.FC<SizeFormProps> = ({
  defaultValues = {
    size_name: '',
    diameter: 0,
    description: '',
  },
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<SizeInput>({
    resolver: zodResolver(sizeSchema),
    defaultValues,
  });

  const handleSubmit = async (data: SizeInput) => {
    try {
      await onSubmit(data);
      if (!defaultValues.size_name) {
        form.reset();
      }
    } catch (error) {
      toast.error('Falha ao salvar tamanho');
      console.error('Erro no envio:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="size_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Tamanho</FormLabel>
              <FormControl>
                <Input placeholder="Pequena" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="diameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diâmetro (cm)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição do tamanho" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-pizza-primary hover:bg-pizza-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : defaultValues.size_name ? 'Atualizar Tamanho' : 'Adicionar Tamanho'}
        </Button>
      </form>
    </Form>
  );
};

export default SizeForm;
