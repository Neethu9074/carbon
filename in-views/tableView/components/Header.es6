import React from 'react';


import {clearSelectedSnapshots} from 'in-views/tableView/stores/selectedSnapshots';
import {showAggregations$, toggle} from 'in-stores/metric/showAggregations';
import TypeSelector from 'in-views/tableView/components/TypeSelector';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import {clearMetrics} from 'in-views/tableView/stores/metrics';
import {plugin$} from 'in-views/tableView/stores/snapshotIds';
import {addMetric} from 'in-views/tableView/stores/metrics';
import MetricSelector from 'in-components/MetricSelector';
import {getPlural} from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './Header.less';

const block = 'in-table-view-header';

export default connectTo({
  showAggregations: showAggregations$,
  plugin: plugin$
},
function Header({plugin, showAggregations}) {
  return (
    <header className={block}>
      <div className={`${block}__left-side`}>
        <TypeSelector />
        <MetricSelector className={`${block}__selector`}
                        plugin={plugin}
                        onChange={addSelectedMetric}
                        label={`Visualize metric for selected ${getPlural(plugin)}`} />
      </div>

      <div className={`${block}__right-side`}>
        <input type='checkbox'
               id='table-view-toggle-aggregations'
               checked={showAggregations}
               onChange={toggle} />
        <label htmlFor='table-view-toggle-aggregations'
               className={`${block}__toggle-aggregations`}>
          <Tooltip content='Show counts and averages across the current time window.'>
            <span>
              Aggregates for metrics over <TimeWindowSizeLabel />
            </span>
          </Tooltip>
        </label>

        <Button kind='secondary'
              size='sm'
              onClick={clearSelection}>
        Clear Selections
      </Button>
      </div>
    </header>
  );
});

function clearSelection() {
  clearMetrics();
  clearSelectedSnapshots();
}

function addSelectedMetric(e) {
  e.preventDefault();
  addMetric(e.target.value);
  e.target.value = '-1';
}
