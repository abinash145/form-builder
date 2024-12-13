import { Plus } from 'lucide-react';

import { DraggableComponentEnum } from '@/lib/type/form-builder.type';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

import { Card } from '../ui/card';

const AddFieldCard = ({
  isActiveFieldDrag,
  hide = false,
}: {
  isActiveFieldDrag: boolean;
  hide?: boolean;
}) => {
  const { setNodeRef } = useDroppable({
    id: "drop",
    data: {
      type: DraggableComponentEnum.dropField,
      id: "drop",
    },
  });
  return (
    <Card
      className={cn(
        " border-dashed hidden",
        !hide && isActiveFieldDrag && "block"
      )}
      ref={setNodeRef}
    >
      <button className="flex items-center justify-center w-full h-20 gap-2">
        <p className="text-center text-md font-medium">Drop your field</p>
        <Plus />
      </button>
    </Card>
  );
};

export default AddFieldCard;
