/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PaginatedMetricList from 'in-new-components/MetricConfigurator/PaginatedMetricList';
import DraggableItemSelector from 'in-new-components/DraggableItemSelector';
import { Col } from 'in-new-components/layout/Grid';
import { shorten } from 'in-services/util/string';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

import locals from './MetricConfiguratorOverlayPresenter.mless';

export default function MetricConfiguratorOverlayPresenter({
  form,
  onChange,
  maximumNumberOfMetrics,
  onChangeAggregation,
  options,
  onAddItem,
  onRemoveItem,
  onSwap,
  getPossibleAggregationsForMetric
}) {
  return (
    <DraggableItemSelector
      getPossibleAggregationsForMetric={getPossibleAggregationsForMetric}
      onChangeAggregation={onChangeAggregation}
      onChange={onChange}
      options={options}
      items={form.items}
      Content={Content}
      onSwap={onSwap}
      onRemove={onRemoveItem}
      disabled={form.items.length === maximumNumberOfMetrics}
      SlideInContent={({ onShowSlideInContentChange }) => (
        <PaginatedMetricList
          form={form}
          options={options}
          isMetricDisabled={metric => isMetricDisabled(metric)}
          onChange={node => {
            onAddItem({ metric: node.metric, aggregation: node.aggregations[0] });
            onShowSlideInContentChange(false);
          }}
        />
      )}
      slideInContentTitle="Add a metric"
    />
  );

  function isMetricDisabled(metric) {
    const items = form.items;
    if (items.length === 0) {
      return false;
    }

    return getPossibleAggregationsForMetric(metric).length === 0;
  }
}

function metricEventPayload(formMetric) {
  return { metric: formMetric.get('metric').value, aggregation: formMetric.get('aggregation').value };
}

function getAllAggregationsOfMetric(options, metric) {
  return options.find(option => option.metric === metric).aggregations;
}

function Content({ i, options, item: metric, onChangeAggregation, getPossibleAggregationsForMetric, onChange }) {
  return (
    <>
      {getAllAggregationsOfMetric(options, metric.get('metric').value).length > 1 ? (
        <>
          <Col xs={5}>
            {metric.get('metric').map(field => (
              <Label
                htmlFor={`metric-configuration-metric-${i}`}
                hasError={!field.valid && field.touched}
                className={locals.label}
              >
                {shorten(options.find(opt => opt.metric === field.value).label, 18)}
              </Label>
            ))}
          </Col>

          {metric.get('aggregation').map(field => (
            <Col xs={5}>
              <Select
                id={`metric-configuration-aggregation-${i}`}
                value={field.value}
                onChange={e => {
                  const aggregation = e.target.value;
                  if (onChangeAggregation) {
                    onChangeAggregation(metricEventPayload(metric), aggregation);
                  }
                  onChange([i, 'aggregation'], field => field.setValue(aggregation).setTouched(true));
                }}
                className={locals.aggregations}
                hasError={!field.valid && field.touched}
              >
                <option value="" disabled>
                  Please Select
                </option>
                {options
                  .find(option => option.metric === metric.get('metric').value)
                  .aggregations.map(aggregation => (
                    <option
                      key={aggregation}
                      value={aggregation}
                      disabled={!getPossibleAggregationsForMetric(metric.get('metric').value).includes(aggregation)}
                    >
                      {aggregation}
                    </option>
                  ))}
              </Select>
            </Col>
          ))}
        </>
      ) : (
        <Col xs={10}>
          {metric.get('metric').map(field => (
            <Label
              htmlFor={`metric-configuration-metric-${i}`}
              hasError={!field.valid && field.touched}
              className={locals.label}
            >
              {options.find(opt => opt.metric === field.value).label}
            </Label>
          ))}
        </Col>
      )}
    </>
  );
}
