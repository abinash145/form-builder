import {
  Pencil,
  Trash,
} from 'lucide-react';

import {
  DraggableComponentEnum,
  FiledType,
} from '@/lib/type/form-builder.type';
import { useSortable } from '@dnd-kit/sortable';

import { Card } from './card';
import Icon from './Icon';

const Field = ({
  data,
  handleFieldEditClick,
  handleDeleteField,
}: {
  data: FiledType;
  handleFieldEditClick?: (val: FiledType) => void;
  handleDeleteField?: (val: FiledType) => void;
}) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: data.name,
    data: {
      type: DraggableComponentEnum.field,
      id: data.name,
    },
  });

  return (
    <div className="relative h-[30px]">
      <Card
        className="w-full  px-4   flex items-center h-full  "
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <p className="truncate text-sm font-medium"> {data.label}</p>
      </Card>
      <div className="absolute  top-1/2 -translate-y-1/2 right-2 h-full flex gap-1">
        <button
          className=" "
          onClick={() => {
            handleFieldEditClick?.(data);
          }}
        >
          <Icon iconName={Pencil} size={16} />
        </button>
        <button className=" " onClick={() => handleDeleteField?.(data)}>
          <Icon iconName={Trash} size={16} />
        </button>
      </div>
    </div>
  );
};
export default Field;
