export enum DraggableComponentEnum {
  row = "row",
  sideField = "sideField",
  field = "field",
  dropField = "dropField",
}

// input field
export enum FormFieldTypeEnum {
  singleLineText = "single-text",
  number = "number",
  dropdown = "dropdown",
}

export type FiledType = {
  description: string;
  label: string;
  name: string;
  placeholder: string;
  rowId: string;
  columnId: string;
  value: string;
  variant: FormFieldTypeEnum; // Use a string literal type for specific values
  options?: {
    label: string;
    value: string;
  }[];
};
