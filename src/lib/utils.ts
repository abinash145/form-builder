import {
  type ClassValue,
  clsx,
} from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import {
  z,
  ZodTypeAny,
} from 'zod';

import { fieldDefaultValue } from './constants';
import {
  FiledType,
  FormFieldTypeEnum,
} from './type/form-builder.type';

/**
 * A version of `clsx` that supports Tailwind CSS classes.
 *
 * Tailwind's class names are often not valid CSS class names, so we can't use
 * `clsx` directly. Instead, we use `twMerge` to merge the classes.
 *
 * @param inputs - The class names to merge.
 * @returns The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a Zod schema from the given field data.
 *
 * The Zod schema is a key-value object where the keys are the names of the fields,
 * and the values are the Zod types for each field.
 *
 * @param fieldData - The field data to create the schema from.
 * @returns The Zod schema for the given field data.
 */
export const getZodSchema = (fieldData: Array<FiledType>) => {
  const zodSchema: Record<FormFieldTypeEnum, ZodTypeAny> = {
    [FormFieldTypeEnum.singleLineText]: z
      .string()
      .min(1, { message: "Field is required" })
      .max(50, { message: "Filed must not exceed 50 characters." }),
    [FormFieldTypeEnum.number]: z
      .string()
      .min(1, { message: "Field is required" })
      .max(50, { message: "Filed must not exceed 50 characters." }),
    [FormFieldTypeEnum.dropdown]: z
      .string()
      .min(1, { message: "Field is required" })
      .max(50, { message: "Filed must not exceed 50 characters." }),
  };
  const arrayOfFiledSchema = fieldData.map((field) => ({
    [field.name]: zodSchema[field.variant],
  }));
  const finalSchema = arrayOfFiledSchema.reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});
  return z.object(finalSchema);
};

/**
 * Creates a default value for a form from the given field data.
 *
 * The default value is a key-value object where the keys are the names of the
 * fields, and the values are the default values of the fields.
 *
 * @param fieldData - The field data to create the default value from.
 * @returns The default value for the given field data.
 */
export const getFormDefaultValue = (fieldData: Array<FiledType>) => {
  const arrayOfFiledSchema = fieldData.map((field) => ({
    [field.name]: field.value,
  }));
  return arrayOfFiledSchema.reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});
};

/**
 * Generates a new field data object based on the specified variant.
 *
 * This function creates a new field data object by copying the default values
 * of the specified variant and assigning a new unique row ID.
 *
 * @param variant - The type of the form field to generate data for.
 * @returns A new field data object with default values and a unique row ID.
 */
export const getNewFieldData = (
  variant: FormFieldTypeEnum,
  rowId?: string,
  columnId?: string
): FiledType => {
  return {
    ...fieldDefaultValue[variant],
    rowId: rowId || uuidv4(),
    name: "name_" + uuidv4(),
    columnId: columnId || uuidv4(),
  };
};

/**
 * Swaps the positions of two fields within the field data array.
 *
 * This function identifies two fields by their names and swaps their
 * rowId and columnId properties, effectively swapping their positions
 * in a form layout. If either field is not found, the original field data
 * is returned unchanged.
 *
 * @param fieldData - The array of field data objects to modify.
 * @param firstFieldName - The name of the first field to swap.
 * @param secondFieldName - The name of the second field to swap.
 * @returns A new array of field data with the specified fields' positions swapped.
 */
export const swapFieldPositionBetweenField = (
  fieldData: FiledType[],
  firstFieldName: string,
  secondFieldName: string
): FiledType[] => {
  const firstField = fieldData.find((item) => item.name === firstFieldName);
  const secondField = fieldData.find((item) => item.name === secondFieldName);

  // Return the original array if either field is not found
  if (!firstField || !secondField) return fieldData;

  // Swap properties for the matched fields
  return fieldData.map((item) => {
    if (item.name === firstFieldName) {
      return {
        ...item,
        rowId: secondField.rowId,
        columnId: secondField.columnId,
      };
    }
    if (item.name === secondFieldName) {
      return {
        ...item,
        rowId: firstField.rowId,
        columnId: firstField.columnId,
      };
    }
    return item;
  });
};

/**
 * Swaps the rowId property between two fields within the field data array.
 *
 * This function identifies two fields by their rowId and swaps their
 * rowId property, effectively swapping their row positions
 * in a form layout. If either field is not found, the original field data
 * is returned unchanged.
 *
 * @param fieldData - The array of field data objects to modify.
 * @param firstFieldRowId - The rowId of the first field to swap.
 * @param secondFieldRowId - The rowId of the second field to swap.
 * @returns A new array of field data with the specified fields' rowId swapped.
 */
export const swapFieldRowBetweenField = (
  fieldData: FiledType[],
  firstFieldRowId: string,
  secondFieldRowId: string
): FiledType[] => {
  const firstField = fieldData.find((item) => item.rowId === firstFieldRowId);
  const secondField = fieldData.find((item) => item.rowId === secondFieldRowId);

  // Return the original array if either field is not found
  if (!firstField || !secondField) return fieldData;

  // Swap rowId for the matched fields
  return fieldData.map((item) => {
    if (item.rowId === firstFieldRowId) {
      return { ...item, rowId: secondFieldRowId };
    }
    if (item.rowId === secondFieldRowId) {
      return { ...item, rowId: firstFieldRowId };
    }
    return item;
  });
};

/**
 * Generates a random unique identifier using the uuidv4 algorithm.
 *
 * This function can be used to generate a unique identifier for a form field,
 * for example, to create a field with a unique rowId.
 *
 * @returns A string representing a random unique identifier.
 */
export const generateRandomId = () => uuidv4();
