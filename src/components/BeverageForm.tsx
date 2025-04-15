import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BeverageInput } from '@/hooks/useBeverageAdmin';
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

const beverageSchema = z.object({
  beverage_name: z.string().min(2, {
    message: 'O nome da bebida deve ter pelo menos 2 caracteres.',
  }),
  description: z.string().min(5, {
    message: 'A descrição deve ter pelo menos 5 caracteres.',
  }),
  price: z.coerce.number().min(0.01, {
    message: 'O preço deve ser maior que zero.',
  }),
  image_url: z.string().url({ message: "URL da imagem inválida" }).optional().or(z.literal('')), // <-- Adicione/modifique esta linha
});

interface BeverageFormProps {
  defaultValues?: BeverageInput;
  onSubmit: (data: BeverageInput) => Promise<void>;
  isSubmitting: boolean;
}

const BeverageForm: React.FC<BeverageFormProps> = ({
  defaultValues = {
    beverage_name: '',
    description: '',
    price: 0,
    image_url: '', // <-- Adicione valor padrão
  },
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<BeverageInput>({
    resolver: zodResolver(beverageSchema),
    defaultValues,
  });

  const handleSubmit = async (data: BeverageInput) => {
    try {
      await onSubmit(data);
      if (!defaultValues.beverage_name) {
        form.reset();
      }
    } catch (error) {
      toast.error('Falha ao salvar bebida');
      console.error('Erro no envio:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="beverage_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Bebida</FormLabel>
              <FormControl>
                <Input placeholder="Coca-Cola" {...field} />
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
                  placeholder="Refrigerante gelado" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0.01" 
                  placeholder="5.99" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}  
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/bebida.jpg" {...field} />
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
          {isSubmitting ? 'Salvando...' : defaultValues.beverage_name ? 'Atualizar Bebida' : 'Adicionar Bebida'}
        </Button>
      </form>
    </Form>
  );
};

export default BeverageForm;