/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { find, groupBy, findIndex, every } from 'lodash';
import React, { Fragment } from 'react';

import { Button, SvgIcon } from '@instana/components';

import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/metric';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

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
  onClose,
  isGroupedView
}) {
  const selectedMetricDefinition = find(availableMetrics, m => m.metric === newMetricForm.get('metric').value);
  const groupedAvailableMetrics = groupBy(availableMetrics, m => m.category || '');

  return (
    <Dialog title={title} onClose={onClose}>
      <p className={locals.help}>{help}</p>

      <h2 className={locals.header}>{t('in-analyze:components.metricsSelector.addMetric')}</h2>

      <form onSubmit={onAddMetric} autoComplete="off" className={locals.form}>
        {newMetricForm.get('metric').map(field => (
          <FormGroup withoutBottomMargin className={locals.metricGroup}>
            <Label htmlFor="metric-select-metric" hasError={!field.valid && field.touched}>
              {t('in-analyze:components.metricsSelector.metric')}
            </Label>
            <Select
              id="metric-select-metric"
              value={selectedOptionValue(availableMetrics, field, newMetricForm)}
              onChange={e => {
                const [metric, aggregation] = parseOptionValue(e.target.value);
                return onMetricChange(metric, aggregation);
              }}
              hasError={!field.valid && field.touched}
            >
              <option value="" disabled>
                {t('in-analyze:components.metricsSelector.pleaseSelect')}
              </option>

              {Object.keys(groupedAvailableMetrics)
                .sort(compareIgnoreCase)
                .map(group => {
                  const options = groupedAvailableMetrics[group].map(
                    ({ metric, label, unfoldAggregations, supportedAggregations }) => {
                      if (unfoldAggregations && supportedAggregations) {
                        return supportedAggregations.map(aggregation => {
                          return (
                            <option
                              value={toCombinedOptionValue(metric, aggregation)}
                              key={toCombinedOptionValue(metric, aggregation)}
                              disabled={isAggregationSelected(selectedMetricsForm.value, metric, aggregation)}
                            >
                              {`${label} (${aggregationLabels[aggregation]})`}
                            </option>
                          );
                        });
                      } else
                        return (
                          <option
                            value={metric}
                            key={metric}
                            disabled={
                              isMetricAndAllAggregationsSelected(
                                selectedMetricsForm.value,
                                find(availableMetrics, m => m.metric === metric)
                              ) && field.value !== metric
                            }
                          >
                            {label}
                          </option>
                        );
                    }
                  );

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

        {selectedMetricDefinition &&
          !selectedMetricDefinition.unfoldAggregations &&
          supportAggregations(selectedMetricDefinition) &&
          (selectedMetricDefinition.supportedAggregations.length > 1 ||
            newMetricForm.get('aggregation').value !== selectedMetricDefinition.supportedAggregations[0]) &&
          newMetricForm.get('aggregation').map(field => (
            <FormGroup withoutBottomMargin className={locals.aggregationGroup}>
              <Label htmlFor="metric-select-aggregation" hasError={!field.valid && field.touched}>
                {t('in-analyze:components.metricsSelector.aggregation')}
              </Label>
              <Select
                id="metric-select-aggregation"
                value={field.value}
                onChange={e => onAggregationChange(e.target.value)}
                hasError={!field.valid && field.touched}
                disabled={!selectedMetricDefinition}
              >
                <option value="" disabled>
                  {t('in-analyze:components.metricsSelector.pleaseSelect')}
                </option>

                {selectedMetricDefinition &&
                  selectedMetricDefinition.supportedAggregations.map(aggregation => (
                    <option
                      value={aggregation}
                      key={aggregation}
                      disabled={
                        isAggregationSelected(
                          selectedMetricsForm.value,
                          selectedMetricDefinition.metric,
                          aggregation
                        ) && field.value !== aggregation
                      }
                    >
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
          {t('in-analyze:components.metricsSelector.addMetric')}
        </Button>
      </form>

      {selectedMetricsForm.value.length > 0 && (
        <Fragment>
          <h2 className={`${locals.header} ${locals.selectedMetricHeader}`}>
            {t('in-analyze:components.metricsSelector.selectedMetrics')}
          </h2>

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
                      <Draggable key={i} draggableId={String(i)} index={i}>
                        {provided => (
                          <li
                            className={locals.metric}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className={locals.metricLeftSide}>
                              <SvgIcon type="lib_menu" className={locals.draggableIndicator} size="xxs" />
                              {definition.label}
                              {metric.aggregation &&
                                definition.supportedAggregations.length > 1 &&
                                ` (${aggregationLabels[metric.aggregation]})`}
                              {!isGroupedView && !definition.tag && (
                                <Tooltip content={t('in-analyze:metricSelector.tooltipGroups')}>
                                  <SvgIcon
                                    type="lib_help_error_help_outline"
                                    size="xs"
                                    className={locals.metricNotAvailable}
                                  />
                                </Tooltip>
                              )}
                            </div>
                            <Tooltip content={t('in-analyze:metricSelector.tooltipRemove')}>
                              <SvgIcon
                                type="lib_openclose_cancel"
                                size="xs"
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
          {t('in-analyze:components.metricsSelector.save')}
        </Button>
      </div>
    </Dialog>
  );
}

function selectedOptionValue(availableMetrics, field, newMetricForm) {
  const metric = field.value;
  if (!metric) {
    return metric;
  }
  const metricDefinition = find(availableMetrics, m => m.metric === metric);
  return metricDefinition.unfoldAggregations
    ? toCombinedOptionValue(metric, newMetricForm.get('aggregation').value)
    : metric;
}

function toCombinedOptionValue(metric, aggregation) {
  return metric + '|' + aggregation;
}

function parseOptionValue(optionValue) {
  const [metric, aggregation] = optionValue.split('|');
  return [metric, aggregation];
}

function supportAggregations(metricDefinition) {
  return (
    metricDefinition && metricDefinition.supportedAggregations && metricDefinition.supportedAggregations.length > 0
  );
}

function isMetricAndAllAggregationsSelected(selectedMetrics, metricDefinition) {
  if (supportAggregations(metricDefinition)) {
    return every(metricDefinition.supportedAggregations, aggregation =>
      isAggregationSelected(selectedMetrics, metricDefinition.metric, aggregation)
    );
  } else {
    return findIndex(selectedMetrics, { metric: metricDefinition.metric }) > -1;
  }
}

function isAggregationSelected(selectedMetrics, metric, aggregation) {
  return findIndex(selectedMetrics, { metric, aggregation }) > -1;
}
