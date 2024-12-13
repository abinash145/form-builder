import React from 'react';

import {
  GripVertical,
  Minus,
  Plus,
} from 'lucide-react';

import { sideFieldData } from '@/lib/data/side-field.data';
import {
  DraggableComponentEnum,
  FiledType,
} from '@/lib/type/form-builder.type';
import {
  cn,
  generateRandomId,
  getNewFieldData,
} from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';

import { Card } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Field from './ui/Field';
import For from './ui/For';
import Icon from './ui/Icon';

interface IRowContainerProps {
  items: FiledType[];
  setFieldData: React.Dispatch<React.SetStateAction<FiledType[]>>;
  id: string;
  isDragOver?: boolean;
  handleFieldEditClick?: (val: FiledType) => void;
  setRowIds: React.Dispatch<React.SetStateAction<string[]>>;
  setColumnIds: React.Dispatch<React.SetStateAction<string[]>>;
  columnIds: Array<string>;
}

const RowContainer = ({
  items,
  setFieldData,
  id,
  isDragOver,
  handleFieldEditClick,
  setRowIds,
  setColumnIds,
  columnIds,
}: IRowContainerProps) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id,
    data: {
      type: DraggableComponentEnum.row,
      id,
    },
  });

  // /**
  //  * Deletes the current field from the field data array.
  //  */
  const handleDeleteField = (data: FiledType) => {
    setFieldData((prev) => prev.filter((item) => item.name !== data.name));
    setColumnIds((prev) => prev.filter((item) => item !== data.columnId));
    if (items.length < 2) {
      setRowIds((prev) => prev.filter((item) => item !== data.rowId));
    }
  };
  return (
    <div
      className="flex  justify-between relative pr-14 pl-6  h-[30px]"
      ref={setNodeRef}
    >
      <div
        className="grid  gap-2 grow "
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        <For
          each={columnIds.filter((id) => items.some((d) => d.columnId === id))}
        >
          {(item) => (
            <Field
              data={items.find((d) => d.columnId === item) as FiledType}
              handleFieldEditClick={handleFieldEditClick}
              handleDeleteField={handleDeleteField}
            />
          )}
        </For>
      </div>
      <div className="flex absolute right-0  h-full items-center">
        <button
          className="p-1 "
          role="button"
          onClick={() => {
            setFieldData((prev) =>
              prev.filter(
                (data) => String(data.rowId) !== String(items[0].rowId)
              )
            );
            setRowIds((prev) =>
              prev.filter((data) => String(data) !== String(items[0].rowId))
            );
            setColumnIds((prev) =>
              prev.filter((data) => !items.some((d) => d.columnId === data))
            );
          }}
        >
          <Minus width={20} height={20} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 " role="button">
              <Plus width={20} height={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Field List</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <For each={sideFieldData}>
                {(item) => (
                  <DropdownMenuItem
                    onClick={() => {
                      const newColumnId = generateRandomId();
                      setFieldData((prev) => [
                        ...prev,
                        getNewFieldData(item.id, items[0].rowId, newColumnId),
                      ]);
                      setColumnIds((prev) => [...prev, newColumnId]);
                    }}
                  >
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                )}
              </For>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card
        className={cn(
          " absolute left-0 top-0 z-10  w-full h-full border-dashed shadow-none hidden",
          isDragOver && "flex items-center justify-center"
        )}
      >
        <p className="text-center text-sm font-medium">Drop your field</p>
      </Card>
      <button
        className="absolute  top-1/2 -translate-y-1/2 left-0 "
        {...listeners}
        {...attributes}
      >
        <Icon iconName={GripVertical} size={16} />
      </button>
    </div>
  );
};

export default RowContainer;
