import React from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FiledType } from '@/lib/type/form-builder.type';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const formSchema = z.object({
  label: z
    .string()
    .min(1, { message: "Label is required" }) // Ensures required validation
    .max(50, { message: "Label must not exceed 500 characters." }),
  description: z
    .string()
    .min(1, { message: "Description is required" }) // Ensures required validation
    .max(50, { message: "Description must not exceed 500 characters." }),
  placeholder: z
    .string()
    .min(1, { message: "Placeholder is required" }) // Ensures required validation
    .max(50, { message: "Placeholder must not exceed 500 characters." }),
});

const FieldSettingDialog = ({
  setIsFieldSettingOpen,
  isFieldSettingOpen,
  fieldSettingData,
  setFieldData,
}: {
  isFieldSettingOpen: boolean;
  setIsFieldSettingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFieldData: React.Dispatch<React.SetStateAction<Array<FiledType>>>;
  fieldSettingData: FiledType | null;
}) => {
  //use form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: fieldSettingData?.description,
      label: fieldSettingData?.label,
      placeholder: fieldSettingData?.placeholder,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFieldData((prev) =>
      prev.map((item) => {
        if (item.name === fieldSettingData?.name) {
          return { ...fieldSettingData, ...values };
        }
        return item;
      })
    );
    setIsFieldSettingOpen(false);
  }

  return (
    <Dialog open={isFieldSettingOpen} onOpenChange={setIsFieldSettingOpen}>
      <DialogContent>
        <DialogHeader className="font-semibold">Edit Field</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter" {...field} />
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
                    <Input placeholder="description " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="ml-auto block ">
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FieldSettingDialog;
