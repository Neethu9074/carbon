import React from 'react';

import ComboBox from 'in-components/ComboBox';
import {getCategories} from 'in-sdk/metrics';


export default function MetricSelector({id, plugin, onChange, value}) {
  const categoryTree = getCategories(plugin);
  if (categoryTree.length === 0) {
    return null;
  }

  const metrics = [{ value: '', label: 'Please select' }];
  for (let i = 0, length = categoryTree.length; i < length; i++) {
    getMetrics(metrics, categoryTree[i]);
  }
  const select = (
    <ComboBox name={id}
              value={value}
              options={metrics}
              onChange={onChange} />
  );

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
