import { withState } from 'recompose';
import React from 'react';

import { aggregationLabels } from 'in-stores/metric/metric';
import Select from 'in-components/form/Select';

import locals from './AggregationSelector.mless';

const options = ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX'];

export default withState('aggregation', 'setAggregation')(AggregationSelector);

function AggregationSelector({ defaultAggregation, aggregation, setAggregation, children }) {
  return children({
    aggregation: aggregation || defaultAggregation,
    aggregationSelector: (
      <Select
        className={locals.selector}
        value={aggregation || defaultAggregation}
        onChange={e => setAggregation(e.target.value || defaultAggregation)}
      >
        {options.map(option => (
          <option value={option} key={option}>
            {aggregationLabels[option]}
          </option>
        ))}
      </Select>
    )
  });
}
