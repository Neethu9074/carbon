import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { Fragment } from 'react';
import { find, groupBy } from 'lodash';

import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/metric';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MetricSelectorPresenter.mless';

// metrics have the form
//
// [
//   {
//     metric: 'duration',
//     label: 'Duration',
//     aggregation: 'MEAN'
//     formatter: '',
//     category: 'Navigation Timing',
//
//     // may be defined to populate the select box
//     supportedAggregations: ['MEAN', 'SUM', 'P95']
//   }
// ]

export default function MetricSelectorPresenter({
  title,
  help,
  availableMetrics,
  selectedMetricsForm,
  newMetricForm,
  onMetricChange,
  onAggregationChange,
  onRemoveMetric,
  onAddMetric,
  onSwitchMetricPosition,
  onSave,
  onClose
}) {
  const selectedMetricDefinition = find(availableMetrics, m => m.metric === newMetricForm.get('metric').value);

  const groupedAvailableMetrics = groupBy(availableMetrics, m => m.category || '');

  return (
    <Dialog title={title} onClose={onClose}>
      <p className={locals.help}>{help}</p>

      <h2 className={locals.header}>Add Metric</h2>

      <form onSubmit={onAddMetric} autoComplete="off" className={locals.form}>
        {newMetricForm.get('metric').map(field => (
          <FormGroup withoutBottomMargin className={locals.metricGroup}>
            <Label htmlFor="metric-select-metric" hasError={!field.valid && field.touched}>
              Metric
            </Label>
            <Select
              id="metric-select-metric"
              value={field.value}
              onChange={e => onMetricChange(e.target.value)}
              hasError={!field.valid && field.touched}
            >
              <option value="" disabled>
                Please select
              </option>

              {Object.keys(groupedAvailableMetrics)
                .sort(compareIgnoreCase)
                .map(group => {
                  const options = groupedAvailableMetrics[group].map(({ metric, label }) => (
                    <option value={metric} key={metric}>
                      {label}
                    </option>
                  ));

                  if (isBlank(group)) {
                    return <Fragment key={group}>{options}</Fragment>;
                  }

                  return (
                    <optgroup label={group} key={group}>
                      {options}
                    </optgroup>
                  );
                })}
            </Select>
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {newMetricForm.get('aggregation').map(field => (
          <FormGroup withoutBottomMargin className={locals.aggregationGroup}>
            <Label htmlFor="metric-select-aggregation" hasError={!field.valid && field.touched}>
              Aggregation
            </Label>
            <Select
              id="metric-select-aggregation"
              value={field.value}
              onChange={e => onAggregationChange(e.target.value)}
              hasError={!field.valid && field.touched}
              disabled={!selectedMetricDefinition}
            >
              <option value="" disabled>
                Please select
              </option>

              {selectedMetricDefinition &&
                selectedMetricDefinition.supportedAggregations.map(aggregation => (
                  <option value={aggregation} key={aggregation}>
                    {aggregationLabels[aggregation]}
                  </option>
                ))}
            </Select>
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        <Button
          type="submit"
          kind="create"
          className={locals.addButton}
          disabled={newMetricForm.touched && !newMetricForm.hierarchyValid}
        >
          Add Metric
        </Button>
      </form>

      {selectedMetricsForm.value.length > 0 && (
        <Fragment>
          <h2 className={`${locals.header} ${locals.selectedMetricHeader}`}>Selected Metrics</h2>

          <TouchedMessages field={selectedMetricsForm} />

          <DragDropContext
            onDragEnd={e => e.destination && onSwitchMetricPosition(e.source.index, e.destination.index)}
          >
            <Droppable droppableId="droppable">
              {provided => (
                <ul className={locals.metricList} ref={provided.innerRef}>
                  {selectedMetricsForm.value.map((metric, i) => {
                    const definition = find(availableMetrics, m => m.metric === metric.metric);
                    return (
                      <Draggable key={i} draggableId={i} index={i}>
                        {provided => (
                          <li
                            className={locals.metric}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className={locals.metricLeftSide}>
                              <SvgIcon type="lib_menu" className={locals.draggableIndicator} width={12} />
                              {definition ? definition.label : metric.metric} ({aggregationLabels[metric.aggregation]})
                            </div>
                            <Tooltip content="Remove metric">
                              <SvgIcon
                                type="lib_openclose_cancel"
                                width={16}
                                className={locals.removeIcon}
                                onClick={() => onRemoveMetric(metric)}
                              />
                            </Tooltip>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </Fragment>
      )}

      <hr className={locals.separator} />

      <div className={locals.actions}>
        <Button
          kind="primaryv2"
          disabled={selectedMetricsForm.touched && !selectedMetricsForm.hierarchyValid}
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </Dialog>
  );
}
