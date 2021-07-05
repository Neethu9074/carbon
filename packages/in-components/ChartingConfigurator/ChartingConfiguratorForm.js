/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { t } from 'in-i18n';

import locals from './ChartingConfiguratorForm.mless';

export default function ChartingConfiguratorForm({ value, options, onChange, hideRenderer, disableClose }) {
  const activeMetric = options.find(({ metricId }) => metricId === value.metricId) || options[0];
  const activeAggregation =
    activeMetric.aggregations.find(({ id }) => id === value.aggregationId) || activeMetric.aggregations[0];
  const activeRenderer =
    activeAggregation.renderers.find(({ id }) => id === value.rendererId) || activeAggregation.renderers[0];
  const multipleMetrics = options.length > 1;
  const multipleAggregations = activeMetric.aggregations.length > 1;

  return (
    <div className={locals.wrapper}>
      {multipleMetrics ? (
        <ComboBoxBehavior
          options={options.map(({ metricId, label }) => ({ value: metricId, label }))}
          value={activeMetric.metricId}
          onChange={metricId => {
            const change = {
              ...value,
              metricId
            };
            const metric = options.find(opt => opt.metricId === metricId);
            let aggregation = metric.aggregations.find(opt => opt.id === change.aggregationId);
            if (!aggregation) {
              aggregation = metric.aggregations[0];
              change.aggregationId = aggregation.id;
            }

            const renderer = aggregation.renderers.find(opt => opt.id === change.rendererId);
            if (!renderer) {
              change.rendererId = aggregation.renderers[0].id;
            }

            onChange(change);
          }}
          requiresCustomInteractivity
          aria-label={t('in-components:chartingConfigurator.labelChangeSelectedMetric')}
        >
          {({ elementProps }) => (
            <div {...elementProps} className={classNames(locals.metric, locals.selectable)}>
              {activeMetric.label}
            </div>
          )}
        </ComboBoxBehavior>
      ) : (
        <div className={locals.metric}>{activeMetric.label}</div>
      )}

      {multipleAggregations ? (
        <ComboBoxBehavior
          options={activeMetric.aggregations
            .map(({ id, label }) => ({ value: id, label }))
            .sort((agg1, agg2) => agg1.label.localeCompare(agg2.label))}
          value={activeAggregation.id}
          disableAutomaticOptionSorting
          onChange={aggregationId => {
            const change = {
              ...value,
              aggregationId
            };
            const aggregation = activeMetric.aggregations.find(opt => opt.id === aggregationId);
            const renderer = aggregation.renderers.find(opt => opt.id === change.rendererId);
            if (!renderer) {
              change.rendererId = aggregation.renderers[0].id;
            }

            onChange(change);
          }}
          requiresCustomInteractivity
          aria-label={t('in-components:chartingConfigurator.labelChangeSelectedAggregation')}
        >
          {({ elementProps }) => (
            <div {...elementProps} className={classNames(locals.aggregation, locals.selectable)}>
              {activeAggregation.label}
            </div>
          )}
        </ComboBoxBehavior>
      ) : (
        <div className={classNames(locals.aggregation, locals.singleAggregation)}>{activeAggregation.label}</div>
      )}

      {!hideRenderer && (
        <ComboBoxBehavior
          options={activeAggregation.renderers.map(({ id, label }) => ({ value: id, label }))}
          value={activeRenderer.id}
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
    </div>
  );
}
