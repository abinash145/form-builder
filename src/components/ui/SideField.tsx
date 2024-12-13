import { GripVertical } from 'lucide-react';

import {
  DraggableComponentEnum,
  FiledType,
  FormFieldTypeEnum,
} from '@/lib/type/form-builder.type';
import {
  generateRandomId,
  getNewFieldData,
} from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';

import { Card } from './card';
import Icon from './Icon';

interface FieldListProps {
  title: string;
  id: FormFieldTypeEnum;
  setFieldData: React.Dispatch<React.SetStateAction<FiledType[]>>;
  setRowIds: React.Dispatch<React.SetStateAction<string[]>>;
  setColumnIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const SideField = ({
  title,
  id,
  setFieldData,
  setRowIds,
  setColumnIds,
}: FieldListProps) => {
  const { setNodeRef, attributes, listeners } = useDraggable({
    id,
    data: {
      type: DraggableComponentEnum.sideField,
      id,
    },
  });
  return (
    <Card
      className="card cursor-pointer relative"
      ref={setNodeRef}
      onClick={() => {
        const newRowId = generateRandomId();
        const newColumnId = generateRandomId();
        setFieldData((prev) => [
          ...prev,
          getNewFieldData(id, newRowId, newColumnId),
        ]);
        setRowIds((prev) => [...prev, newRowId]);
        setColumnIds((prev) => [...prev, newColumnId]);
      }}
    >
      <div className="flex gap-2 justify-start items-center px-2 py-1">
        <button className="cursor-move" {...listeners} {...attributes}>
          <Icon iconName={GripVertical} size={16} />
        </button>
        <p className="text-gray-800 font-medium text-xs text-center">{title}</p>
      </div>
    </Card>
  );
};

export default SideField;
