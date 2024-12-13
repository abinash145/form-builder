import {
  useMemo,
  useState,
} from 'react';

import { sideFieldData } from '@/lib/data/side-field.data';
import {
  DraggableComponentEnum,
  FiledType,
  FormFieldTypeEnum,
} from '@/lib/type/form-builder.type';
import {
  generateRandomId,
  getNewFieldData,
} from '@/lib/utils';
import {
  Active,
  DataRef,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  Over,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import FieldList from './FieldList';
import FormMaintain from './FormMaintain';
import RowContainer from './RowContainer';
import Field from './ui/Field';
import SideField from './ui/SideField';

const FormBuilder = () => {
  //use State
  const [fieldData, setFieldData] = useState<Array<FiledType>>([]);
  const [rowIds, setRowIds] = useState<Array<string>>([]);
  const [columnIds, setColumnIds] = useState<Array<string>>([]);
  const [activeDragData, setActiveDragData] = useState<{
    type: DraggableComponentEnum;
    id?: string | FormFieldTypeEnum;
  } | null>(null);

  //use Sensor
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 0, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 0, tolerance: 5 },
    })
  );

  //use Memo
  //column index array
  const rowFieldArray = useMemo(() => {
    return rowIds.map((idx) => fieldData.filter((f) => f.rowId === idx));
  }, [fieldData, rowIds]);
  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="grid grid-cols-12 gap-4 p-4 md:min-h-screen">
          <div className="col-span-12 md:col-span-2 ">
            <FieldList
              setFieldData={setFieldData}
              setRowIds={setRowIds}
              setColumnIds={setColumnIds}
            />
          </div>
          <div className="col-span-12 md:col-span-10 ">
            <FormMaintain
              rowFieldArray={rowFieldArray}
              fieldData={fieldData}
              activeDragData={activeDragData}
              setFieldData={setFieldData}
              rowIds={rowIds}
              setRowIds={setRowIds}
              setColumnIds={setColumnIds}
              columnIds={columnIds}
            />
          </div>
        </div>

        <DragOverlay>
          {activeDragData?.type === DraggableComponentEnum.sideField && (
            <SideField
              title={
                sideFieldData.find((f) => f.id === activeDragData.id)
                  ?.name as string
              }
              id={FormFieldTypeEnum.singleLineText}
              setFieldData={setFieldData}
              setRowIds={setRowIds}
              setColumnIds={setColumnIds}
            />
          )}
          {activeDragData?.type === DraggableComponentEnum.row && (
            <RowContainer
              items={fieldData.filter(
                (f) => String(f.rowId) === String(activeDragData.id)
              )}
              setFieldData={setFieldData}
              id={activeDragData?.id || ""}
              isDragOver={false}
              setRowIds={setRowIds}
              setColumnIds={setColumnIds}
              columnIds={columnIds}
            />
          )}
          {activeDragData?.type === DraggableComponentEnum.field && (
            <Field
              data={
                fieldData.find(
                  (f) => String(f.name) === String(activeDragData.id)
                ) as FiledType
              }
            />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );

  // #region drag start
  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === DraggableComponentEnum.sideField) {
      setActiveDragData({ type: data?.type, id: data.id });
      return;
    }

    if (data?.type === DraggableComponentEnum.row) {
      setActiveDragData({ type: data?.type, id: data.id });
      return;
    }
    if (data?.type === DraggableComponentEnum.field) {
      setActiveDragData({ type: data?.type, id: data.id });
      return;
    }
  }

  // #region drag end
  function onDragEnd(event: DragEndEvent) {
    setActiveDragData(null);

    const { active, over } = event;
    if (!over) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    //active data
    const isActiveSideField =
      activeData?.type === DraggableComponentEnum.sideField;
    const isActiveField = activeData?.type === DraggableComponentEnum.field;

    //over data
    const isOverField = overData?.type === DraggableComponentEnum.field;
    const isOverDropField = overData?.type === DraggableComponentEnum.dropField;

    if (isActiveSideField && isOverField) {
      const overRowId = fieldData.find((f) => f.name === overData.id)?.rowId;
      const newColumnId = generateRandomId();
      if (isOverField) {
        setFieldData((prev) => [
          ...prev,
          getNewFieldData(
            activeData.id as FormFieldTypeEnum,
            overRowId,
            newColumnId
          ),
        ]);
        setColumnIds((prev) => [...prev, newColumnId]);
      }
    }

    if (isOverDropField && (isActiveSideField || isActiveField)) {
      const newRowId = generateRandomId();
      const newColumnId = generateRandomId();
      if (isActiveSideField) {
        setFieldData((prev) => [
          ...prev,
          getNewFieldData(
            activeData.id as FormFieldTypeEnum,
            newRowId,
            newColumnId
          ),
        ]);
        setRowIds((prev) => [...prev, newRowId]);
        setColumnIds((prev) => [...prev, newColumnId]);
      }
    }
  }

  // #region drag over
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    //active data
    const isActiveRow = activeData?.type === DraggableComponentEnum.row;

    const isActiveField = activeData?.type === DraggableComponentEnum.field;

    //over data
    const isOverRow = overData?.type === DraggableComponentEnum.row;
    const isOverField = overData?.type === DraggableComponentEnum.field;

    //swap row
    if (isActiveRow && isOverRow) {
      setRowIds((prev) => {
        const activeIndex = prev.findIndex((idx) => idx === activeData.id);

        const overIndex = prev.findIndex((idx) => idx === overData.id);

        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    if (isActiveField && isOverField) {
      const currentActiveFieldData = fieldData.find(
        (item) => item.name === activeData.id
      );
      const currentOverFieldData = fieldData.find(
        (item) => item.name === overData.id
      );
      //swap column when in same row
      if (currentActiveFieldData?.rowId === currentOverFieldData?.rowId) {
        setColumnIds((prev) => {
          const activeIndex = prev.findIndex(
            (idx) => idx === currentActiveFieldData?.columnId
          );
          const overIndex = prev.findIndex(
            (idx) => idx === currentOverFieldData?.columnId
          );
          return arrayMove(prev, activeIndex, overIndex);
        });
        return;
      }
      setFieldData((prev) =>
        prev.map((item) => {
          if (item.name === activeData.id) {
            const numberOfRowData = prev.filter(
              (d) => d.rowId === item.rowId
            ).length;
            if (numberOfRowData < 2) {
              setRowIds((row) => row.filter((idx) => idx !== item.rowId));
            }
            return {
              ...item,
              rowId: currentOverFieldData?.rowId as string,
            };
          }
          return item;
        })
      );
    }
  }

  function hasDraggableData<T extends Active | Over>(
    entry: T | null | undefined
  ): entry is T & {
    data: DataRef<{ type: DraggableComponentEnum; id: string }>;
  } {
    if (!entry) {
      return false;
    }

    const data = entry.data.current;

    if (
      data?.type === DraggableComponentEnum.row ||
      data?.type === DraggableComponentEnum.sideField ||
      data?.type === DraggableComponentEnum.field ||
      data?.type === DraggableComponentEnum.dropField
    ) {
      return true;
    }

    return false;
  }
};

export default FormBuilder;
