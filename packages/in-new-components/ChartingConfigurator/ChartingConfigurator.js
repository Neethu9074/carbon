/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import ChartingConfiguratorForm from 'in-new-components/ChartingConfigurator/ChartingConfiguratorForm';
import { aggregationLabels } from 'in-stores/metric/metric';
import { rendererShape } from 'in-stores/metric/renderer';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

import locals from './ChartingConfigurator.mless';

export default function ChartingConfigurator({ options, value, onChange, hideRenderer, disableClose, tracking }) {
  if (!value && options?.length > 0) {
    return (
      <Button
        className={locals.addChartButton}
        kind="subtle"
        size="compact"
        icon="lib_openclose_add"
        onClick={() => {
          const chartConfig = {
            metricId: options[0].metricId,
            aggregationId: options[0].aggregations[0].id,
            rendererId: options[0].aggregations[0].renderers[0].id
          };
          tracking?.onChartChanged?.(chartConfig);
          onChange(chartConfig);
        }}
      >
        {t('in-new-components:chartingConfigurator.buttonAddChart')}
      </Button>
    );
  }

  if (!options?.length > 0) {
    return null;
  }

  return (
    <ChartingConfiguratorForm
      value={value}
      options={options}
      onChange={chartConfig => {
        tracking?.onChartChanged?.(chartConfig);
        onChange(chartConfig);
      }}
      hideRenderer={hideRenderer}
      disableClose={disableClose}
    />
  );
}

const aggregationShape = PropTypes.shape({
  id: PropTypes.oneOf(Object.keys(aggregationLabels)).isRequired,
  label: PropTypes.string.isRequired,
  renderers: PropTypes.arrayOf(rendererShape).isRequired
});

const optionShape = PropTypes.shape({
  metricId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.node,
  aggregations: PropTypes.arrayOf(aggregationShape).isRequired
});

const trackingShape = {
  onChartChanged: PropTypes.func
};

ChartingConfigurator.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    metricId: PropTypes.string,
    aggregationId: PropTypes.string,
    rendererId: PropTypes.string
  }),
  options: PropTypes.arrayOf(optionShape).isRequired,
  hideRenderer: PropTypes.bool,
  disableClose: PropTypes.bool,
  tracking: PropTypes.shape(trackingShape)
};
