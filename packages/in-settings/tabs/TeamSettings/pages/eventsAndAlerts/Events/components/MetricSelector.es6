import React from 'react';

import EditableTextInput from 'in-components/EditableTextInput/EditableTextInput';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import { getPlainMetricList } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';

export default function MetricSelector({ id, plugin, onChange, value, metrics }) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : getPlainMetricList(plugin);

  if (instanaInternalFeaturesEnabled) {
    metricsList.push({
      value: 'custom',
      label: 'custom'
    });
  }

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

  const select = <ComboBox name={id} value={value} options={metricsList} onChange={onChange} />;

  if (value === 'custom') {
    return (
      <div>
        {select}
        <EditableTextInput text={value} onSave={text => onChange({ value: text })} />
      </div>
    );
  }

  return select;
}
