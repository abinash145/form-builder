import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierCaveDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { fieldDefaultImportCode } from '@/lib/constants';
import {
  FiledType,
  FormFieldTypeEnum,
} from '@/lib/type/form-builder.type';

const Code = ({
  rowFieldArray,
  fieldData,
}: {
  rowFieldArray: Array<Array<FiledType>>;
  fieldData: Array<FiledType>;
}) => {
  return (
    <SyntaxHighlighter language="react" style={atelierCaveDark}>
      {`import { useForm } from 'react-hook-form';
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
 import { zodResolver } from '@hookform/resolvers/zod';

 ${generateImport(fieldData)}

const FormPreview = () => {
  const { toast } = useToast();
  const formSchema = z.object({
 ${generateSchema(fieldData)}
})
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
      ${generateFormField(rowFieldArray)}
        <Button type="submit" className="ml-auto block ">
          Submit
        </Button>
      </form>
    </Form>
  );
};



  `}
    </SyntaxHighlighter>
  );
};

export default Code;

/**
 * Generate the import statement for form field types based on the given field data
 *
 * @param {Array<FiledType>} fieldData - The field data to generate the import statement
 * @returns {string} The generated import statement
 */
const generateImport = (fieldData: Array<FiledType>) => {
  const imp = [];

  if (
    fieldData.some(
      (item) =>
        item.variant === FormFieldTypeEnum.singleLineText ||
        item.variant === FormFieldTypeEnum.number
    )
  ) {
    imp.push(fieldDefaultImportCode[FormFieldTypeEnum.singleLineText]);
  }
  if (fieldData.some((item) => item.variant === FormFieldTypeEnum.dropdown)) {
    imp.push(fieldDefaultImportCode[FormFieldTypeEnum.dropdown]);
  }
  return imp.join("\n");
};

/**
 * Generates a Zod schema for the given field data.
 *
 * @returns The schema for the given field data as a string
 */

const generateSchema = (fieldData: Array<FiledType>) => {
  return fieldData
    .map(
      (item) => `${item.name}: z
        .string()
        .min(1, { message: "Field is required" })
        .max(50, { message: "Filed must not exceed 50 characters." }),`
    )
    .join("\n");
};

/**
 * Generate form field based on the given rowFieldArray
 * @param rowFieldArray
 * @returns a string of form field elements
 */
const generateFormField = (rowFieldArray: Array<Array<FiledType>>) => {
  return rowFieldArray
    .map(
      (item) =>
        `<div
    className="grid gap-2"
    style={{
      gridTemplateColumns: \`repeat(${item.length}, minmax(0, 1fr))\`,
    }}
  >
    ${getFormFieldCode(item)}
  </div>`
    )
    .join("\n");
};

/**
 * Generates a string of form field components based on the provided field data.
 *
 * @param fieldData - An array of field definitions, where each field contains
 *                    information such as name, label, placeholder, and type.
 * @returns A string representation of the form fields, formatted as JSX elements,
 *          that can be rendered within a form component. The fields are generated
 *          according to their specified type, such as single-line text, dropdown,
 *          or number.
 */
const getFormFieldCode = (fieldData: Array<FiledType>) => {
  const defaultFromFieldCode = {
    [FormFieldTypeEnum.singleLineText]: (item: FiledType) => ` <FormField
                      control={form.control}
                      name=${item.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.label}</FormLabel>
                          <FormControl>
                           <Input
                                  placeholder=${item.placeholder}
                                  {...field}
                                />
                          </FormControl>
                          {item.description && (
                            <FormDescription>${item.description}</FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />`,
    [FormFieldTypeEnum.dropdown]: (item: FiledType) => ` <FormField
                      control={form.control}
                      name={item.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>${item.label}</FormLabel>
                          <FormControl>
                            
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="">
                                    <SelectValue
                                      placeholder=${item.placeholder}
                                    />
                                  </SelectTrigger>
  
                                  <SelectContent>
                                        <SelectItem value="default">
                                          Default
                                        </SelectItem>
                                        <SelectItem value="default-2">
                                          Default 2
                                        </SelectItem>
                                        <SelectItem value="default-3">
                                          Default 3
                                        </SelectItem>
  
                                      </SelectContent>
                                    
                          </FormControl>
                          
                            <FormDescription>${item.description}</FormDescription>
                      
                          <FormMessage />
                        </FormItem>
                      )}
                    />`,

    [FormFieldTypeEnum.number]: (item: FiledType) => ` <FormField
                      control={form.control}
                      name=${item.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>${item.label}</FormLabel>
                          <FormControl>
                           <Input
                                  type="number"
                                  placeholder={item.placeholder}
                                  {...field}
                                />
                          </FormControl>
                          
                            <FormDescription>${item.description}</FormDescription>
                      
                          <FormMessage />
                        </FormItem>
                      )}
                    />`,
  };
  return fieldData
    .map((item) => defaultFromFieldCode[item.variant](item))
    .join("\n");
};
