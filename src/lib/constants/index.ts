import {
  FiledType,
  FormFieldTypeEnum,
} from '../type/form-builder.type';

export const fieldDefaultValue: Record<FormFieldTypeEnum, FiledType> = {
  [FormFieldTypeEnum.singleLineText]: {
    description: "",
    label: "Text",
    name: "name_" + "",
    placeholder: "",
    rowId: "",
    columnId: "",
    value: "",
    variant: FormFieldTypeEnum.singleLineText,
  },
  [FormFieldTypeEnum.dropdown]: {
    description: "",
    label: "Select",
    name: "name_" + "",
    placeholder: "",
    rowId: "",
    columnId: "",
    value: "",
    variant: FormFieldTypeEnum.dropdown,
  },
  [FormFieldTypeEnum.number]: {
    description: "",
    label: "Number",
    name: "name_" + "",
    placeholder: "",
    rowId: "",
    columnId: "",
    value: "",
    variant: FormFieldTypeEnum.number,
  },
};

export const fieldDefaultImportCode: Record<FormFieldTypeEnum, string> = {
  [FormFieldTypeEnum.singleLineText]: ` import { Input } from '@/components/ui/input'`,
  [FormFieldTypeEnum.dropdown]: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'`,

  [FormFieldTypeEnum.number]: ` import { Input } from '@/components/ui/input'`,
};
