import React from 'react';

import EditableTextInput from 'in-components/EditableTextInput/EditableTextInput';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import { getPlainMetricList } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';

export default function MetricSelector({ id, plugin, onChange, value }) {
  const metrics = getPlainMetricList(plugin);
  if (instanaInternalFeaturesEnabled) {
    metrics.push({
      value: 'custom',
      label: 'custom'
    });
  }
  const select = <ComboBox name={id} value={value} options={metrics} onChange={onChange} />;

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
