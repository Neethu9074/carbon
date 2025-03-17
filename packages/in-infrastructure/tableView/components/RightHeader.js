/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { clearSelectedSnapshots } from 'in-infrastructure/tableView/stores/selectedSnapshots';
import { showAggregations$, toggle } from 'in-stores/metric/showAggregations';
import { clearMetrics } from 'in-infrastructure/tableView/stores/metrics';
import { formatDurationAccurately } from 'in-services/formatters/date';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './RightHeader.less';

const block = 'in-table-view-right-header';

export default connectTo(
  {
    showAggregations: showAggregations$
  },
  function RightHeader({ showAggregations, clearTableSelection }) {
    const windowSize = useTimeWindowSize();

    return (
      <header className={block}>
        <input type="checkbox" id="table-view-toggle-aggregations" checked={showAggregations} onChange={toggle} />
        <label htmlFor="table-view-toggle-aggregations" className={`${block}__toggle-aggregations`}>
          <Tooltip content={t('in-infrastructure:tableView.showCountsAndAveragesAcrossTheCurrentTimeWindow')}>
            <span>{t('in-infrastructure:tableView.aggregatesForMetricsOver', { windowSize })}</span>
          </Tooltip>
        </label>

        <Button
          darkTheme
          kind="secondary"
          size="compact"
          onClick={() => {
            clearSelection();
            clearTableSelection();
          }}
        >
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

function useTimeWindowSize() {
  const timeConfig = useTimeConfig();
  return formatDurationAccurately(timeConfig.windowSize);
}
