import { compose, withState } from 'recompose';
import React from 'react';

import Select from 'in-components/form/Select';

import locals from './AggregationSelector.mless';

const options = [
  { label: 'mean', value: 'MEAN' },
  { label: 'min', value: 'MIN' },
  { label: '25th', value: 'P25' },
  { label: '50th', value: 'P50' },
  { label: '75th', value: 'P75' },
  { label: '90th', value: 'P90' },
  { label: '95th', value: 'P95' },
  { label: '98th', value: 'P98' },
  { label: '99th', value: 'P99' },
  { label: 'max', value: 'MAX' }
];

export default compose(withState('aggregation', 'setAggregation'))(AggregationSelector);

function AggregationSelector({ defaultAggregation, aggregation, setAggregation, children }) {
  return children({
    aggregation: aggregation || defaultAggregation,
    aggregationSelector: (
      <Select
        className={locals.selector}
        value={aggregation || defaultAggregation}
        onChange={e => setAggregation(e.target.value || defaultAggregation)}
      >
        {options.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </Select>
    )
  });
}
