import PropTypes from 'prop-types';
import React from 'react';

import ChartingConfiguratorForm from 'in-new-components/ChartingConfigurator/ChartingConfiguratorForm';
import { allFormatterIds } from 'in-stores/metric/formatters';
import { aggregationLabels } from 'in-stores/metric/metric';
import { rendererShape } from 'in-stores/metric/renderer';
import Button from 'in-new-components/Button';

import locals from './ChartingConfigurator.mless';

export default function ChartingConfigurator({ options, value, onChange, hideRenderer }) {
  if (!value) {
    return (
      <Button
        className={locals.addChartButton}
        kind="subtle"
        size="compact"
        icon="lib_openclose_add"
        onClick={() =>
          onChange({
            metricId: options[0].metricId,
            aggregationId: options[0].aggregations[0].id,
            rendererId: options[0].aggregations[0].renderers[0].id
          })
        }
      >
        Add Chart
      </Button>
    );
  }

  return <ChartingConfiguratorForm value={value} options={options} onChange={onChange} hideRenderer={hideRenderer} />;
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
  formatter: PropTypes.oneOf(allFormatterIds).isRequired,
  aggregations: PropTypes.arrayOf(aggregationShape).isRequired
});

ChartingConfigurator.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    metricId: PropTypes.string,
    aggregationId: PropTypes.string,
    rendererId: PropTypes.string
  }),
  options: PropTypes.arrayOf(optionShape).isRequired,
  hideRenderer: PropTypes.bool
};
