import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  FiledType,
  FormFieldTypeEnum,
} from '@/lib/type/form-builder.type';
import {
  getFormDefaultValue,
  getZodSchema,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import For from '../ui/For';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Show from '../ui/Show';
import {
  Match,
  Switch,
} from '../ui/Switch';

const FormPreview = ({
  rowFieldArray,
  fieldData,
}: {
  rowFieldArray: Array<Array<FiledType>>;
  fieldData: Array<FiledType>;
}) => {
  const { toast } = useToast();
  const formSchema = getZodSchema(fieldData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...getFormDefaultValue(fieldData),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      description: "Your form is ready",
    });
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <For
          each={rowFieldArray}
          fallback={<p>Please Select Field to preview your result</p>}
        >
          {(col) => (
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${col.length}, minmax(0, 1fr))`,
              }}
            >
              <For
                each={col}
                fallback={<p>Please Select Field to preview your result</p>}
              >
                {(item) => (
                  <FormField
                    control={form.control}
                    name={item.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{item.label}</FormLabel>
                        <FormControl>
                          <Switch
                            fallback={
                              <p>Your selected field is not available</p>
                            }
                          >
                            <Match
                              when={
                                item.variant ===
                                FormFieldTypeEnum.singleLineText
                              }
                            >
                              <Input
                                placeholder={item.placeholder}
                                {...field}
                              />
                            </Match>
                            <Match
                              when={item.variant === FormFieldTypeEnum.number}
                            >
                              <Input
                                type="number"
                                placeholder={item.placeholder}
                                {...field}
                              />
                            </Match>
                            <Match
                              when={item.variant === FormFieldTypeEnum.dropdown}
                            >
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="">
                                  <SelectValue
                                    placeholder={item.placeholder || "Select"}
                                  />
                                </SelectTrigger>

                                <Show
                                  when={item.options}
                                  fallback={
                                    <SelectContent>
                                      <SelectItem value="default">
                                        Default
                                      </SelectItem>
                                      <SelectItem value="default-2">
                                        Default 2
                                      </SelectItem>
                                    </SelectContent>
                                  }
                                >
                                  <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">
                                      System
                                    </SelectItem>
                                  </SelectContent>
                                </Show>
                              </Select>
                            </Match>
                          </Switch>
                        </FormControl>
                        {item.description && (
                          <FormDescription>{item.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </For>
            </div>
          )}
        </For>

        <Button type="submit" className="ml-auto block ">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default FormPreview;
