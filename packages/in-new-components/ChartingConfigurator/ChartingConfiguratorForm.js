import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ChartingConfiguratorForm.mless';

export default function ChartingConfiguratorForm({ value, options, onChange, hideRenderer }) {
  const activeMetric = options.find(({ metricId }) => metricId === value.metricId) || options[0];
  const activeAggregation =
    activeMetric.aggregations.find(({ id }) => id === value.aggregationId) || activeMetric.aggregations[0];
  const activeRenderer = activeAggregation.renderers.find(({ id }) => id === value.rendererId) || activeAggregation.renderers[0];

  return (
    <div className={locals.wrapper}>
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
        ariaLabel="Change selected metric"
      >
        {({ elementProps }) => (
          <div {...elementProps} className={locals.metric}>
            {activeMetric.label}
          </div>
        )}
      </ComboBoxBehavior>

      <ComboBoxBehavior
        options={activeMetric.aggregations.map(({ id, label }) => ({ value: id, label }))}
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
        ariaLabel="Change selected aggregation"
      >
        {({ elementProps }) => (
          <div {...elementProps} className={locals.aggregation}>
            {activeAggregation.label}
          </div>
        )}
      </ComboBoxBehavior>

      { !hideRenderer && <ComboBoxBehavior
          options={activeAggregation.renderers.map(({ id, label }) => ({ value: id, label }))}
          value={activeRenderer.id}
          onChange={rendererId =>
            onChange({
              ...value,
              rendererId
            })
          }
          requiresCustomInteractivity
          ariaLabel="Change selected renderer"
        >
          {({ elementProps }) => (
            <div {...elementProps} className={locals.renderer}>
              {activeRenderer.label}
            </div>
          )}
        </ComboBoxBehavior>
      }

      <SvgIcon
        className={locals.removeIcon}
        type="lib_openclose_cancel"
        data-test="lib_openclose_cancel"
        onClick={() => onChange(null)}
      />
    </div>
  );
}
