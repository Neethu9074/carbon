/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import ChartSelectorOverlay, { getActiveChartMetric } from 'in-components/ChartingConfigurator/ChartSelectorOverlay';
import GroupedMetricSelectorOverlay from 'in-components/ChartingConfigurator/GroupedMetricSelectorOverlay';
import { CustomMetricInput } from 'in-applications/analyze/AnalyzeView2_0/components/CustomMetricInput';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { t } from 'in-i18n';

import locals from './ChartingConfiguratorForm.mless';

export default function ChartingConfiguratorForm({
  value,
  options,
  onChange,
  hideRenderer,
  disableClose,
  dataSource,
  unifiedMetricsSource
}) {
  const activeTemplate = options?.templates?.find(({ templateId }) => templateId === value.templateId);

  let activeAggregation, activeRenderer;

  let activeMetric = getActiveChartMetric(options, value);

  if (!activeTemplate) {
    activeAggregation =
      activeMetric?.aggregations?.find(({ id }) => id === value.aggregationId) || activeMetric?.aggregations?.[0];
    activeRenderer =
      activeAggregation?.renderers?.find(({ id }) => id === value.rendererId) || activeAggregation?.renderers?.[0];
  }

  const multipleMetricsAndTemplates = Object.values(options).reduce((acc, curr) => (acc += curr?.length ?? 0), 0);
  const multipleAggregations = activeMetric?.aggregations?.length > 1;

  return (
    <>
      {multipleMetricsAndTemplates ? (
        <ChartSelectorOverlay
          value={value}
          options={options}
          dataSource={dataSource}
          overlayContent={GroupedMetricSelectorOverlay}
          unifiedMetricsSource={unifiedMetricsSource}
          overlayProps={{ dataSource, unifiedMetricsSource }}
          onChange={onChange}
          aria-label={t('in-components:chartingConfigurator.labelChangeSelectedMetric')}
        />
      ) : (
        <div className={classNames(locals.metric, locals.singleMetric)}>
          <ChartSelectorOverlay
            value={value}
            options={options}
            dataSource={dataSource}
            overlayContent={GroupedMetricSelectorOverlay}
            unifiedMetricsSource={unifiedMetricsSource}
            overlayProps={{ dataSource, unifiedMetricsSource }}
            onChange={onChange}
            aria-label={t('in-components:chartingConfigurator.labelChangeSelectedMetric')}
          />
        </div>
      )}

      {activeMetric?.customMetric && (
        <CustomMetricInput
          value={activeMetric.secondLevelMetricId}
          options={activeMetric.metricTagSuggestions?.map(tag => tag.label)}
          onChange={secondLevelMetricId => {
            const change = {
              ...value,
              metricId: `${activeMetric.metricId}.${secondLevelMetricId}`,
              secondLevelMetricId
            };
            onChange(change);
          }}
        />
      )}

      {multipleAggregations && !activeTemplate ? (
        <ComboBoxBehavior
          options={activeMetric?.aggregations
            .map(({ id, label }) => ({ value: id, label }))
            .sort((agg1, agg2) => agg1.label.localeCompare(agg2.label))}
          value={activeAggregation?.id}
          disableAutomaticOptionSorting
          onChange={aggregationId => {
            const change = {
              ...value,
              aggregationId
            };
            const aggregation = activeMetric?.aggregations?.find(opt => opt.id === aggregationId);
            const renderer = aggregation?.renderers?.find(opt => opt.id === change.rendererId);
            if (!renderer) {
              change.rendererId = aggregation?.renderers?.[0]?.id;
            }
            onChange(change);
          }}
          requiresCustomInteractivity
          aria-label={t('in-components:chartingConfigurator.labelChangeSelectedAggregation')}
        >
          {({ elementProps }) => (
            <div {...elementProps} className={classNames(locals.aggregation, locals.selectable)}>
              {activeAggregation?.label}
            </div>
          )}
        </ComboBoxBehavior>
      ) : (
        activeAggregation?.label && (
          <div className={classNames(locals.aggregation, locals.singleAggregation)}>{activeAggregation?.label}</div>
        )
      )}

      {!hideRenderer && !activeTemplate && (
        <ComboBoxBehavior
          options={activeAggregation?.renderers?.map(({ id, label }) => ({ value: id, label }))}
          value={activeRenderer?.id}
          onChange={rendererId =>
            onChange({
              ...value,
              rendererId
            })
          }
          requiresCustomInteractivity
          aria-label={t('in-components:chartingConfigurator.labelChangeSelectedRenderer')}
        >
          {({ elementProps }) => (
            <div {...elementProps} className={locals.renderer}>
              {activeRenderer.label}
            </div>
          )}
        </ComboBoxBehavior>
      )}

      {!disableClose && (
        <SvgIcon
          className={locals.removeIcon}
          type="lib_openclose_cancel"
          data-test="lib_openclose_cancel"
          onClick={() => onChange(null)}
        />
      )}
    </>
  );
}
