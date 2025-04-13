
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
    message: 'Pizza name must be at least 2 characters.',
  }),
  description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }),
  image_url: z.string().url({ message: 'Please enter a valid URL' }).optional(),
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
      toast.error('Failed to save pizza');
      console.error('Submit error:', error);
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
              <FormLabel>Pizza Name</FormLabel>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Delicious pizza with fresh mozzarella, tomatoes, and basil" 
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
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/pizza.jpg" {...field} />
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
          {isSubmitting ? 'Saving...' : defaultValues.pizza_name ? 'Update Pizza' : 'Add Pizza'}
        </Button>
      </form>
    </Form>
  );
};

export default PizzaForm;
