import React from 'react';

import MetricSelector from 'in-infrastructure/tableView/components/MetricSelector';
import { addMetric, metrics$ } from 'in-infrastructure/tableView/stores/metrics';
import TypeSelector from 'in-infrastructure/tableView/components/TypeSelector';
import { plugin$ } from 'in-infrastructure/tableView/stores/snapshotIds';
import { getPlural } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './LeftHeader.less';

const block = 'in-table-view-left-header';

export default connectTo(
  {
    plugin: plugin$,
    selectedMetrics: metrics$
  },
  function Header({ plugin, selectedMetrics }) {
    return (
      <header className={block}>
        <TypeSelector />
        <MetricSelector
          className={`${block}__selector`}
          plugin={plugin}
          onChange={addSelectedMetric}
          selectedMetrics={selectedMetrics}
          label={`Visualize metric for selected ${getPlural(plugin)}`}
        />
      </header>
    );
  }
);

function addSelectedMetric(e) {
  e.preventDefault();
  addMetric(e.target.value);
  e.target.value = '-1';
}
