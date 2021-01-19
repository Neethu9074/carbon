/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React from 'react';

import ServiceExtractionRuleDialog from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRuleDialog';
import ServiceExtractionRule from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRule';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

import locals from './DragAndDropRuleList.mless';
import { getPreview } from 'in-applications/Forms/CustomServiceMapping/ServiceExtractionRuleDialog';

export default class DragAndDropRuleList extends React.Component {
  displayName = 'DragAndDropRuleList';

  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    this.props.switchIndices(result.source.index, result.destination.index);
  }

  render() {
    const { form, setValue } = this.props;
    if (form.size === 0) {
      return null;
    }

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef}>
              {form.map((serviceConfig, index) => (
                <Draggable key={index} draggableId={index} index={index}>
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
                        onEdit={e => this.onServiceExtractionRuleClicked(index, e)}
                        onRemove={() => this.props.onRemove(index)}
                        preview={getPreview(serviceConfig)}
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

  onServiceExtractionRuleClicked = index => {
    addActiveDialog(
      <ServiceExtractionRuleDialog
        form={this.props.form}
        serviceConfigIndex={index}
        onSave={_serviceConfigs => this.props.onSave(_serviceConfigs, index)}
        onRemove={() => this.props.onRemove(index)}
        addMatchSpecification={this.props.addMatchSpecification}
        removeMatchSpecification={this.props.removeMatchSpecification}
        updateForm={this.props.updateForm}
      />
    );
  };
}
