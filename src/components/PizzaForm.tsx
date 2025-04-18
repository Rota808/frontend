
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PizzaInput } from '@/services/api';
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

const pizzaSchema = z.object({
  pizza_name: z.string().min(2, {
    message: 'O nome da pizza deve ter pelo menos 2 caracteres.',
  }),
  description: z.string().min(5, {
    message: 'A descrição deve ter pelo menos 5 caracteres.',
  }),
  image_url: z.string().url({ message: 'Por favor, insira uma URL válida' }).optional(),
});

interface PizzaFormProps {
  defaultValues?: PizzaInput;
  onSubmit: (data: PizzaInput) => Promise<void>;
  isSubmitting: boolean;
}

const PizzaForm: React.FC<PizzaFormProps> = ({
  defaultValues = {
    pizza_name: '',
    description: '',
    image_url: '',
  },
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<PizzaInput>({
    resolver: zodResolver(pizzaSchema),
    defaultValues,
  });

  const handleSubmit = async (data: PizzaInput) => {
    try {
      await onSubmit(data);
      if (!defaultValues.pizza_name) {
        form.reset();
      }
    } catch (error) {
      toast.error('Falha ao salvar pizza');
      console.error('Erro no envio:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pizza_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Pizza</FormLabel>
              <FormControl>
                <Input placeholder="Margherita" {...field} />
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
                  placeholder="Deliciosa pizza com mussarela fresca, tomates e manjericão" 
                  {...field} 
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
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/pizza.jpg" {...field} />
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
          {isSubmitting ? 'Salvando...' : defaultValues.pizza_name ? 'Atualizar Pizza' : 'Adicionar Pizza'}
        </Button>
      </form>
    </Form>
  );
};

export default PizzaForm;
