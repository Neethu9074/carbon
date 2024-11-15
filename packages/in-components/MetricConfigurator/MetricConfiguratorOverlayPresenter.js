/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Select } from '@instana/components';

import PaginatedMetricList from 'in-components/MetricConfigurator/PaginatedMetricList';
import DraggableItemSelector from 'in-components/DraggableItemSelector';
import { Col } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

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
  getPossibleAggregationsForMetric,
  MetricConfiguratorHint
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
      disabled={form.items.length >= maximumNumberOfMetrics}
      shouldTriggerWindowResize
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
      slideInContentTitle={t('in-components:metricConfigurator.titleAddAMetric')}
      MetricConfiguratorHint={MetricConfiguratorHint}
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

function hasNoAggregationsToSelect(options, metric) {
  return options.find(option => option.metric === metric.get('metric').value).aggregations.length < 2;
}

function Content({
  i,
  options,
  item: metric,
  onChangeAggregation,
  getPossibleAggregationsForMetric,
  onChange,
  MetricConfiguratorHint
}) {
  return (
    <>
      <Col xs={5}>
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

      {metric.get('aggregation').map(field => (
        <Col xs={4}>
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
            disabled={hasNoAggregationsToSelect(options, metric)}
          >
            <option value="" disabled>
              {t('in-components:metricConfigurator.labelPleaseSelect')}
            </option>
            {options
              .find(option => option.metric === metric.get('metric').value)
              .aggregations.map(aggregation => (
                <option
                  key={aggregation}
                  value={aggregation}
                  disabled={!getPossibleAggregationsForMetric(metric.get('metric').value).includes(aggregation)}
                >
                  {t('in-components:metricConfigurator.aggregation', {
                    context: aggregation.replace(/_/g, '')
                  })}
                </option>
              ))}
          </Select>
        </Col>
      ))}
      <Col xs={1}>{MetricConfiguratorHint && <MetricConfiguratorHint metricId={metric.get('metric').value} />}</Col>
    </>
  );
}
