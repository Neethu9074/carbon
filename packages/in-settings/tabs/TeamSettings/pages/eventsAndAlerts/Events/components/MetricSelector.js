import React from 'react';

import Typeahead from 'in-analyze/components/EditTagFilterDialog/Typeahead';
import { emptyArray } from 'in-services/fixedObjects';
import { getPlainMetricList } from 'in-sdk/metrics';

export default function MetricSelector({ plugin, onChange, value, metrics }) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : getPlainMetricList(plugin);

  return (
    <Typeahead
      options={(metricsList || emptyArray).map(metric => ({
        value: metric.value,
        label: metric.label
      }))}
      resultsToShow={100}
      value={value}
      placeholder="Type to filter the results…"
      onChange={onChange}
    />
  );
}
