/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import React, { useCallback } from 'react';
import { CSS } from '@dnd-kit/utilities';

import ServiceExtractionRuleDialog from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRuleDialog';
import ServiceExtractionRule from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRule';
import { getPreview } from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRuleDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

import locals from './DragAndDropRuleList.mless';

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'relative',
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={locals.item}>
      {children}
    </div>
  );
};

export default function DragAndDropRuleList(props) {
  const {
    switchIndices,
    form,
    updateForm,
    setValue,
    onSave,
    onRemove,
    addMatchSpecification,
    removeMatchSpecification,
    serviceMappingTagCatalog
  } = props;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = useCallback(
    ({ active, over }) => {
      if (active.id !== over.id) {
        switchIndices(active.id, over.id);
      }
    },
    [switchIndices]
  );

  const onServiceExtractionRuleClicked = useCallback(
    index => {
      addActiveDialog(
        <ServiceExtractionRuleDialog
          form={form}
          serviceConfigIndex={index}
          onSave={_serviceConfigs => onSave(_serviceConfigs, index)}
          onRemove={() => onRemove(index)}
          addMatchSpecification={addMatchSpecification}
          removeMatchSpecification={removeMatchSpecification}
          updateForm={updateForm}
          serviceMappingTagCatalog={serviceMappingTagCatalog}
        />
      );
    },
    [addMatchSpecification, form, onRemove, onSave, removeMatchSpecification, updateForm, serviceMappingTagCatalog]
  );

  if (form.size === 0) {
    return null;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={form.map((_, i) => String(i))}>
        <div>
          {form.map((serviceConfig, index) => (
            <SortableItem key={String(index)} id={String(index)}>
              <ServiceExtractionRule
                reorderable
                serviceConfig={serviceConfig.toJS()}
                onToggleEnable={enabled => setValue([index, 'enabled'], enabled, form)}
                onEdit={() => onServiceExtractionRuleClicked(index)}
                onRemove={() => onRemove(index)}
                preview={getPreview(serviceConfig)}
                editDisabled={serviceMappingTagCatalog == null}
              />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
