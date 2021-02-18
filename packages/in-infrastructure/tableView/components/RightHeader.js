/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t, Trans } from 'in-i18n';
import React from 'react';

import { clearSelectedSnapshots } from 'in-infrastructure/tableView/stores/selectedSnapshots';
import { showAggregations$, toggle } from 'in-stores/metric/showAggregations';
import { clearMetrics } from 'in-infrastructure/tableView/stores/metrics';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
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
          <Tooltip content={t('in-infrastructure:tableView.showCountsAndAveragesAcrossTheCurrentTimeWindow')}>
            <span>
              <Trans
                i18nKey="in-infrastructure:tableView.aggregatesForMetricsOver"
                components={{
                  windowSize: <TimeWindowSizeLabel />
                }}
              />
            </span>
          </Tooltip>
        </label>

        <Button kind="secondary" size="compact" onClick={clearSelection}>
          {t('in-infrastructure:tableView.clearSelections')}
        </Button>
      </header>
    );
  }
);

function clearSelection() {
  clearMetrics();
  clearSelectedSnapshots();
}
