import React from 'react';

import {getCategories} from 'in-sdk/metrics';

import './MetricSelector.less';


const block = 'in-metric-selector';

function MetricNode({categoryNode}) {
  if (categoryNode.type === 'metric') {
    return (
      <option value={categoryNode.metric}>{categoryNode.label}</option>
    );
  } else if (categoryNode.children.length === 0) {
    return null;
  }

  return (
    <optgroup label={categoryNode.label}>
      {categoryNode.children.map((subCategoryNode, i) =>
        <MetricNode key={i}
                    categoryNode={subCategoryNode} />
      )}
    </optgroup>
  );
}

export default function MetricSelector({className, plugin, label, onChange, value}) {
  const categoryTree = getCategories(plugin);
  if (categoryTree.length === 0) {
    return null;
  }

  let classes = block;
  if (className) {
    classes += ` ${className}`;
  }

  const select = (
    <select id='metric-selector'
            className={`${block}__selection`}
            value={value}
            onChange={onChange}>
      <option value='-1'>Please select</option>

      {categoryTree.map((categoryNode, i) =>
        <MetricNode key={i}
                    categoryNode={categoryNode} />
      )}
    </select>
  );

  if (label) {
    return (
      <label htmlFor='metric-selector'
             className={classes}>
        {label ?
          <span className={`${block}__label`}>
            {label}
          </span>
          : null
        }

        {select}
      </label>
    );
  }

  return select;
}
