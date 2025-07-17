/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Select } from '@instana/components';

import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import { getCrossSeriesAggregation, parseAggregation } from 'in-infrastructure/util/aggregation';
import FilterEmptyValuesToggle from 'in-components/FilterEmptyValueToggle/FilterEmptyValueToggle';
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
  onQueryChange,
  crossSeriesSumEnabled
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
      crossSeriesSumEnabled={crossSeriesSumEnabled}
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
    />
  );
}

function metricEventPayload(metric, aggregation) {
  return {
    metric,
    aggregation: aggregation.timeAggregation,
    crossSeriesAggregation: getCrossSeriesAggregation(aggregation)
  };
}

function Content({
  i,
  item: metric,
  onChangeAggregation,
  onChange,
  MetricCatalogConfiguratorHint,
  uniqueMetricsLabels,
  crossSeriesSumEnabled
}) {
  const crossSeriesAggregationField = metric.get('crossSeriesAggregation');
  const isSumCrossSeriesAggregation = crossSeriesAggregationField.value === 'SUM';
  const allowedCrossSeriesAggregations = [];
  const isCrossSeriesAggregationRestricted = allowedCrossSeriesAggregations?.value?.length > 0;
  const aggregationField = metric.get('aggregation');
  const isCrossSeriesSumAggregationToggleEnabled =
    !isCrossSeriesAggregationRestricted && ['MEAN', 'MIN', 'MAX'].includes(aggregationField.value);
  return (
    <>
      <Col xs={4}>
        {metric.get('metric').map(field => (
          <div className={locals.label} key={`metric-configuration-metric-${i}`}>
            <Label htmlFor={`metric-configuration-metric-${i}`} hasError={!field.valid && field.touched}>
              <MetricLabel label={{ data: uniqueMetricsLabels[i] }} />
            </Label>
          </div>
        ))}
      </Col>

      <Col xs={4}>
        {metric.get('aggregation').map(field => (
          <Select
            id={`metric-configuration-aggregation-${i}`}
            key={`metric-configuration-aggregation-${i}`}
            value={field.value}
            onChange={e => {
              const timeAggregation = e.target.value;
              const aggregation = parseAggregation(timeAggregation, metric.get('crossSeriesAggregation')?.value);
              if (onChangeAggregation) {
                onChangeAggregation(metricEventPayload(metric.get('metric')?.value, aggregation), timeAggregation);
              }
              onChange([], form =>
                form
                  .updateIn([i, 'aggregation'], field => field.setValue(aggregation.timeAggregation).setTouched(true))
                  .updateIn([i, 'crossSeriesAggregation'], field =>
                    field.setValue(getCrossSeriesAggregation(aggregation)).setTouched(true)
                  )
              );
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

      {crossSeriesSumEnabled && (
        <Col xs={1}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip
              content={getCrossSeriesAggregationTooltip(
                isCrossSeriesAggregationRestricted,
                isCrossSeriesSumAggregationToggleEnabled,
                aggregationField.value
              )}
            >
              <span
                id={`metric-configuration-cross-series-aggregation-${i}`}
                onClick={() => {
                  if (!isCrossSeriesSumAggregationToggleEnabled) return;
                  onChange([i, 'crossSeriesAggregation'], field =>
                    field.setValue(isSumCrossSeriesAggregation ? undefined : 'SUM').setTouched(true)
                  );
                }}
                className={[
                  locals.crossSeriesAggregationToggle,
                  isCrossSeriesSumAggregationToggleEnabled && locals.enabled,
                  isSumCrossSeriesAggregation && locals.active
                ]
                  .filter(Boolean)
                  .join(' ')}
                title={t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregation')}
              >
                ∑
              </span>
            </Tooltip>
          </div>
        </Col>
      )}

      {infraExploreFilterEmptyValueEnabled && (
        <RequiredToggle
          metric={metric}
          onChange={required => onChange([i, 'required'], field => field.setValue(required).setTouched(true))}
        />
      )}

      {MetricCatalogConfiguratorHint && (
        <Col xs={1}>
          <MetricCatalogConfiguratorHint metricId={metric.get('metric')?.value} />
        </Col>
      )}
    </>
  );
}

function RequiredToggle({ metric, onChange }) {
  const required = metric.get('required').map(field => field.value);
  const handleToggle = () => onChange(!required);

  return (
    <FilterEmptyValuesToggle
      value={required}
      onToggle={handleToggle}
      hideLabel={t('in-components:metricConfigurator.labelHideEmptyValues')}
      showLabel={t('in-components:metricConfigurator.labelShowEmptyValues')}
    />
  );
}

function getCrossSeriesAggregationTooltip(
  isCrossSeriesAggregationRestricted,
  isCrossSeriesAggregationEnabled,
  aggregation
) {
  if (isCrossSeriesAggregationRestricted) {
    return t(
      'in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationRestrictedHelp'
    );
  }
  return !isCrossSeriesAggregationEnabled && !['SUM', 'PER_SECOND', 'INCREASE'].includes(aggregation)
    ? t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationDisabledHelp', {
        aggregation: aggregationLabels[aggregation]
      })
    : '';
}
