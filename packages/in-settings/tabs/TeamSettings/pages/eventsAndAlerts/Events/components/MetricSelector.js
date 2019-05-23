import React from 'react';

import { getPlainMetricList } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';

export default function MetricSelector({ id, plugin, onChange, value, metrics }) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : getPlainMetricList(plugin);

  metricsList.forEach(metricDef => {
    if (metricDef.origLabel) {
      return;
    }
    metricDef.origLabel = metricDef.label;
    metricDef.label = (
      <span
        style={{
          maxWidth: '720px',
          display: 'inline-block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {metricDef.label}
      </span>
    );
  });

  return <ComboBox name={id} value={value} options={metricsList} onChange={onChange} />;
}
