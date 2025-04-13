
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PizzaPriceInput, Pizza, Size } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const pizzaPriceSchema = z.object({
  pizza: z.number({
    required_error: 'Please select a pizza',
  }),
  size: z.number({
    required_error: 'Please select a size',
  }),
  price: z.number({
    required_error: 'Please enter a price',
  }).min(0.01, {
    message: 'Price must be greater than 0',
  }),
});

interface PizzaPriceFormProps {
  pizzas: Pizza[];
  sizes: Size[];
  onSubmit: (data: PizzaPriceInput) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: Partial<PizzaPriceInput>;
}

const PizzaPriceForm: React.FC<PizzaPriceFormProps> = ({
  pizzas,
  sizes,
  onSubmit,
  isSubmitting,
  defaultValues = {},
}) => {
  const form = useForm<PizzaPriceInput>({
    resolver: zodResolver(pizzaPriceSchema),
    defaultValues: {
      pizza: defaultValues.pizza || 0,
      size: defaultValues.size || 0,
      price: defaultValues.price || 0,
    },
  });

  const handleSubmit = async (data: PizzaPriceInput) => {
    await onSubmit(data);
    if (!defaultValues.pizza) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pizza"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pizza</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value ? field.value.toString() : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pizza" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pizzas.map((pizza) => (
                    <SelectItem key={pizza.id} value={pizza.id.toString()}>
                      {pizza.pizza_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value ? field.value.toString() : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size.id} value={size.id.toString()}>
                      {size.size_name} ({size.diameter}cm)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0.01"
                  placeholder="10.99" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
          {isSubmitting ? 'Saving...' : defaultValues.pizza ? 'Update Price' : 'Add Price'}
        </Button>
      </form>
    </Form>
  );
};

export default PizzaPriceForm;
