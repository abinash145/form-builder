import { useState } from 'react';

import {
  DraggableComponentEnum,
  FiledType,
  FormFieldTypeEnum,
} from '@/lib/type/form-builder.type';
import { SortableContext } from '@dnd-kit/sortable';

import AddFieldCard from './Card/AddField';
import Code from './Code';
import FieldSettingDialog from './Dialog/FieldSettingDialog';
import FormPreview from './FormPreview/FormPreview';
import RowContainer from './RowContainer';
import { Card } from './ui/card';
import For from './ui/For';
import {
  ScrollArea,
  ScrollBar,
} from './ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';

const FormMaintain = ({
  rowFieldArray,
  fieldData,
  setFieldData,
  activeDragData,
  rowIds,
  setRowIds,
  columnIds,
  setColumnIds,
}: {
  rowFieldArray: Array<Array<FiledType>>;
  fieldData: Array<FiledType>;
  setFieldData: React.Dispatch<React.SetStateAction<FiledType[]>>;
  setRowIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeDragData: {
    type: DraggableComponentEnum;
    id?: string | FormFieldTypeEnum;
  } | null;
  rowIds: Array<string>;
  columnIds: Array<string>;
  setColumnIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [isFieldSettingOpen, setIsFieldSettingOpen] = useState<boolean>(false);
  const [fieldSettingData, setFieldSettingData] = useState<FiledType | null>(
    null
  );

  return (
    <>
      <Tabs defaultValue="sort" className="">
        <ScrollArea className="max-w-[500px] mx-auto ">
          <TabsList className="grid  grid-cols-4  mx-auto">
            <TabsTrigger value="sort">Sort</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="json">Json</TabsTrigger>
          </TabsList>
        </ScrollArea>
        <TabsContent value="sort" className="gap-4 h-full ">
          <Card className="p-4 flex flex-col gap-4 min-h-[calc(100dvh_-_76px)]">
            <SortableContext items={rowIds}>
              <For
                each={rowIds}
                fallback={
                  <p className="text-center text-md font-medium">
                    Please click or drag a side field from field list
                  </p>
                }
              >
                {(rowId) => (
                  <RowContainer
                    items={fieldData.filter((d) => d.rowId === rowId)}
                    setFieldData={setFieldData}
                    id={rowId}
                    isDragOver={
                      activeDragData?.type === DraggableComponentEnum.sideField
                    }
                    handleFieldEditClick={(val) => {
                      setIsFieldSettingOpen(true);
                      setFieldSettingData(val);
                    }}
                    setRowIds={setRowIds}
                    setColumnIds={setColumnIds}
                    columnIds={columnIds}
                  />
                )}
              </For>
              <AddFieldCard
                isActiveFieldDrag={!!activeDragData}
                hide={activeDragData?.type === DraggableComponentEnum.row}
              />
            </SortableContext>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card className="p-4">
            <FormPreview rowFieldArray={rowFieldArray} fieldData={fieldData} />
          </Card>
        </TabsContent>
        <TabsContent value="code">
          <Card className="p-4">
            <Code rowFieldArray={rowFieldArray} fieldData={fieldData} />
          </Card>
        </TabsContent>
        <TabsContent value="json">
          <Card className="p-4">
            <ScrollArea className="h-[calc(100dvh_-_110px)] rounded-md">
              <ScrollBar orientation="horizontal" />
              <pre>
                <code>{JSON.stringify(fieldData, null, 2)}</code>
              </pre>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
      <FieldSettingDialog
        fieldSettingData={fieldSettingData}
        isFieldSettingOpen={isFieldSettingOpen}
        setIsFieldSettingOpen={setIsFieldSettingOpen}
        setFieldData={setFieldData}
        key={fieldSettingData?.name}
      />
    </>
  );
};

export default FormMaintain;
