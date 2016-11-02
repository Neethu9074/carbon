import React from 'react';

import {plugin$} from 'in-views/tableView/stores/snapshotIds';
import {addMetric} from 'in-views/tableView/stores/metrics';
import {getCategories} from 'in-sdk/metrics';
import {getPlural} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './MetricSelector.less';

const block = 'in-table-view-metric-selector';

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

export default connectTo({
  plugin: plugin$,
  categoryTree: plugin$.map(getCategories)
}, function MetricSelector({plugin, categoryTree}) {
  if (categoryTree.length === 0) {
    return null;
  }

  return (
    <label htmlFor='table-view-metric-selector'
           className={block}>
      Visualize metric for selected {getPlural(plugin)}:

      <select id='table-view-metric-selector'
              className={`${block}__selection`}
              onChange={addSelectedMetric}>
        <option value='-1'>Please select</option>

        {categoryTree.map((categoryNode, i) =>
          <MetricNode key={i}
                      categoryNode={categoryNode} />
        )}
      </select>
    </label>
  );
});


function addSelectedMetric(e) {
  e.preventDefault();
  addMetric(e.target.value);
  e.target.value = '-1';
}
