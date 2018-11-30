import { compose, withState } from 'recompose';
import React from 'react';

import ComboBox from 'in-components/ComboBox';

const options = [
  { label: 'mean', value: 'MEAN' },
  { label: 'max', value: 'MAX' },
  { label: 'min', value: 'MIN' },
  { label: '25th', value: 'P25' },
  { label: '50th', value: 'P50' },
  { label: '75th', value: 'P75' },
  { label: '90th', value: 'P90' },
  { label: '95th', value: 'P95' },
  { label: '98th', value: 'P98' },
  { label: '99th', value: 'P99' }
];

export default compose(withState('aggregation', 'setAggregation'))(AggregationSelector);

function AggregationSelector({ defaultAggregation, aggregation, setAggregation, children }) {
  return children({
    aggregation: aggregation || defaultAggregation,
    aggregationSelector: (
      <ComboBox
        value={aggregation || defaultAggregation}
        onChange={e => setAggregation((e && e.value) || defaultAggregation)}
        placeholder="Type…"
        options={options}
        isClearable={false}
      />
    )
  });
}
