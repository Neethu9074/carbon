/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { clearSelectedSnapshots } from 'in-infrastructure/tableView/stores/selectedSnapshots';
import { showAggregations$, toggle } from 'in-stores/metric/showAggregations';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import { clearMetrics } from 'in-infrastructure/tableView/stores/metrics';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import './RightHeader.less';

const block = 'in-table-view-right-header';

export default connectTo(
  {
    showAggregations: showAggregations$
  },
  function RightHeader({ showAggregations }) {
    return (
      <header className={block}>
        <input type="checkbox" id="table-view-toggle-aggregations" checked={showAggregations} onChange={toggle} />
        <label htmlFor="table-view-toggle-aggregations" className={`${block}__toggle-aggregations`}>
          <Tooltip content="Show counts and averages across the current time window.">
            <span>
              Aggregates for metrics over <TimeWindowSizeLabel />
            </span>
          </Tooltip>
        </label>

        <Button kind="secondary" size="compact" onClick={clearSelection}>
          Clear Selections
        </Button>
      </header>
    );
  }
);

function clearSelection() {
  clearMetrics();
  clearSelectedSnapshots();
}
