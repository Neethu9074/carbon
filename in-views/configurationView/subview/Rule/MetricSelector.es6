import React from 'react';

import EditableTextInput from 'in-components/EditableTextInput/EditableTextInput';
import { isInstanaEmployee } from 'in-stores/user';
import { getCategories } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';

export default function MetricSelector({ id, plugin, onChange, value }) {
  const categoryTree = getCategories(plugin);
  if (categoryTree.length === 0) {
    return null;
  }

  const metrics = [{ value: '', label: 'Please select' }];
  for (let i = 0, length = categoryTree.length; i < length; i++) {
    getMetrics(metrics, categoryTree[i]);
  }
  if (isInstanaEmployee()) {
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

function getMetrics(allOptions, categoryNode) {
  if (categoryNode.type === 'metric') {
    allOptions.push({
      value: categoryNode.metric,
      label: `${categoryNode.label} (${categoryNode.metric})`
    });
  } else {
    for (let i = 0, length = categoryNode.children.length; i < length; i++) {
      getMetrics(allOptions, categoryNode.children[i]);
    }
  }
}
