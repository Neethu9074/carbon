import React from 'react';

import TypeSelector from 'in-views/tableView/components/TypeSelector';
import { plugin$ } from 'in-views/tableView/stores/snapshotIds';
import { addMetric } from 'in-views/tableView/stores/metrics';
import MetricSelector from 'in-components/MetricSelector';
import { getPlural } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './LeftHeader.less';

const block = 'in-table-view-left-header';

export default connectTo(
  {
    plugin: plugin$
  },
  function Header({ plugin }) {
    return (
      <header className={block}>
        <TypeSelector />
        <MetricSelector
          className={`${block}__selector`}
          plugin={plugin}
          onChange={addSelectedMetric}
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
