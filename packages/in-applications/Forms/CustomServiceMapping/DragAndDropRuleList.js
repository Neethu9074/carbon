/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useCallback } from 'react';

import ServiceExtractionRuleDialog from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRuleDialog';
import ServiceExtractionRule from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRule';
import { getPreview } from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRuleDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

import locals from './DragAndDropRuleList.mless';

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

  const onDragEnd = useCallback(
    result => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }
      switchIndices(result.source.index, result.destination.index);
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <div ref={provided.innerRef}>
            {form.map((serviceConfig, index) => (
              <Draggable key={index} draggableId={String(index)} index={index}>
                {provided => (
                  <div
                    className={locals.item}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ServiceExtractionRule
                      reorderable
                      serviceConfig={serviceConfig.toJS()}
                      onToggleEnable={enabled => setValue([index, 'enabled'], enabled, form)}
                      onEdit={() => onServiceExtractionRuleClicked(index)}
                      onRemove={() => onRemove(index)}
                      preview={getPreview(serviceConfig)}
                      editDisabled={serviceMappingTagCatalog == null}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
