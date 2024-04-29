/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Select, Toggle } from '@instana/components';

import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import { default as MetricLabel } from 'in-infrastructure/Explore/components/MetricLabel';
import { getUniqueMetricsLabels } from 'in-custom-dashboards/widgets/Chart/util';
import { infraExploreFilterEmptyValueEnabled } from 'in-services/featureFlags';
import DraggableItemSelector from 'in-components/DraggableItemSelector';
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import { mapData } from 'in-services/util/result';
import { noop } from 'in-services/util/function';
import { Col } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './MetricCatalogConfiguratorOverlayPresenter.mless';

export default function MetricCatalogConfiguratorOverlayPresenter({
  form,
  onChange,
  maximumNumberOfMetrics,
  onChangeAggregation,
  onAddItem,
  onRemoveItem,
  onSwap,
  getPossibleAggregationsForMetric,
  shouldTriggerWindowResize,
  MetricCatalogConfiguratorHint,
  metricCatalog,
  metricMetadatas,
  loading,
  query,
  onQueryChange
}) {
  const metrics = form.items.map(field => {
    const label =
      mapData(metricMetadatas, data => data[field.get('metric').value]?.label)?.data ?? field.get('label')?.value;
    const metric =
      mapData(metricMetadatas, data => data[field.get('metric').value]?.metric)?.data ?? field.get('metric')?.value;
    const aggregation = field.get('aggregation')?.value;

    return {
      label,
      metric,
      aggregation
    };
  });

  const uniqueMetricsLabels = getUniqueMetricsLabels(metrics);

  return (
    <DraggableItemSelector
      getPossibleAggregationsForMetric={getPossibleAggregationsForMetric}
      onChangeAggregation={onChangeAggregation}
      onChange={onChange}
      items={form.items}
      metricMetadatas={metricMetadatas}
      Content={Content}
      onSwap={onSwap}
      metrics={metrics}
      uniqueMetricsLabels={uniqueMetricsLabels}
      onRemove={onRemoveItem}
      shouldTriggerWindowResize={shouldTriggerWindowResize}
      disabled={form.items.length >= maximumNumberOfMetrics}
      SlideInContent={({ onShowSlideInContentChange, disabled }) => (
        <MetricSelectorOverlay
          shouldTriggerWindowResize={shouldTriggerWindowResize}
          metricCatalog={metricCatalog}
          onChange={node => {
            const crossSeriesAggregation = node.allowedCrossSeriesAggregations
              ? node.allowedCrossSeriesAggregations[0]
              : undefined;
            onAddItem({ metric: node.metric, aggregation: 'MEAN', crossSeriesAggregation });
            onShowSlideInContentChange(false);
          }}
          loading={loading}
          query={query}
          onQueryChange={onQueryChange}
          close={noop}
          disabled={disabled}
        />
      )}
      slideInContentTitle={t('in-components:metricConfigurator.titleAddAMetric')}
      MetricCatalogConfiguratorHint={MetricCatalogConfiguratorHint}
      className={locals.overlay}
    />
  );
}

function metricEventPayload(formMetric) {
  return { metric: formMetric.get('metric').value, aggregation: formMetric.get('aggregation').value };
}

function Content({
  i,
  item: metric,
  onChangeAggregation,
  onChange,
  MetricCatalogConfiguratorHint,
  uniqueMetricsLabels
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
            <MetricLabel label={{ data: uniqueMetricsLabels[i] }} />
          </Label>
        ))}
      </Col>

      <Col xs={3}>
        {metric.get('aggregation').map(field => (
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
              {t('in-components:metricConfigurator.labelPleaseSelect')}
            </option>
            {Object.keys(aggregationLabels).map(key => (
              <option key={key} value={key}>
                {aggregationLabels[key]}
              </option>
            ))}
          </Select>
        ))}
      </Col>
      {infraExploreFilterEmptyValueEnabled && (
        <FilterEmptyValuesToggle
          metric={metric}
          onChange={filterEmptyValue =>
            onChange([i, 'filterEmptyValue'], field => field.setValue(filterEmptyValue).setTouched(true))
          }
        />
      )}
      {MetricCatalogConfiguratorHint && (
        <Col xs={1}>
          <MetricCatalogConfiguratorHint metricId={metric.get('metric').value} />
        </Col>
      )}
    </>
  );
}

function FilterEmptyValuesToggle({ metric, onChange }) {
  var filterEmptyValue = metric.get('filterEmptyValue').map(field => field.value);
  return (
    <Tooltip content={t('in-components:metricConfigurator.labelFilterEmptyValue')} delay={500}>
      <span>
        <Toggle checked={filterEmptyValue} onToggle={onChange} />
      </span>
    </Tooltip>
  );
}
