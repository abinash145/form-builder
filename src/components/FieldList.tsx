import { sideFieldData } from '@/lib/data/side-field.data';
import { FiledType } from '@/lib/type/form-builder.type';
import { SortableContext } from '@dnd-kit/sortable';

import { Card } from './ui/card';
import For from './ui/For';
import H2 from './ui/H2';
import SideField from './ui/SideField';

const FieldList = ({
  setFieldData,
  setRowIds,
  setColumnIds,
}: {
  setFieldData: React.Dispatch<React.SetStateAction<FiledType[]>>;
  setRowIds: React.Dispatch<React.SetStateAction<string[]>>;
  setColumnIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <Card className=" p-4 h-full">
      <H2 className="mb-4">Field List</H2>
      <div className=" flex flex-col gap-2">
        <SortableContext items={sideFieldData}>
          <For
            each={sideFieldData}
            fallback={<p>Currently no side field available</p>}
          >
            {(item) => (
              <SideField
                id={item.id}
                title={item.name}
                setFieldData={setFieldData}
                setRowIds={setRowIds}
                setColumnIds={setColumnIds}
              />
            )}
          </For>
        </SortableContext>
      </div>
    </Card>
  );
};

export default FieldList;
