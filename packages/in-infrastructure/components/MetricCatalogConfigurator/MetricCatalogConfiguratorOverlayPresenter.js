/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import { default as MetricLabel } from 'in-infrastructure/Explore/components/MetricLabel';
import DraggableItemSelector from 'in-components/DraggableItemSelector';
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import { mapData } from 'in-services/util/result';
import { noop } from 'in-services/util/function';
import { Col } from 'in-components/layout/Grid';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
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
  MetricCatalogConfiguratorHint,
  metricCatalog,
  metricMetadatas,
  loading,
  query,
  onQueryChange
}) {
  return (
    <DraggableItemSelector
      getPossibleAggregationsForMetric={getPossibleAggregationsForMetric}
      onChangeAggregation={onChangeAggregation}
      onChange={onChange}
      items={form.items}
      metricMetadatas={metricMetadatas}
      Content={Content}
      onSwap={onSwap}
      onRemove={onRemoveItem}
      disabled={form.items.length >= maximumNumberOfMetrics}
      SlideInContent={({ onShowSlideInContentChange, disabled }) => (
        <MetricSelectorOverlay
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

function Content({ i, item: metric, onChangeAggregation, onChange, MetricCatalogConfiguratorHint, metricMetadatas }) {
  const label = mapData(metricMetadatas, data => data[metric.get('metric').value]?.label);
  return (
    <>
      <Col xs={7}>
        {metric.get('metric').map(field => (
          <Label
            htmlFor={`metric-configuration-metric-${i}`}
            hasError={!field.valid && field.touched}
            className={locals.label}
          >
            <MetricLabel label={label} />
          </Label>
        ))}
      </Col>

      {metric.get('aggregation').map(field => (
        <Col xs={3}>
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
        </Col>
      ))}
      {MetricCatalogConfiguratorHint && (
        <Col xs={1}>
          <MetricCatalogConfiguratorHint metricId={metric.get('metric').value} />
        </Col>
      )}
    </>
  );
}
