/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './GenericCustomColumns.mless';

export const VALUE = [
  {
    title: '',
    type: 'custom',
    width: 30,
    cellStyle: {
      textAlign: 'center'
    },
    disableSorting: true,
    typeArgs: {
      get(row) {
        const index = row.pinnedMetrics.indexOf(row.key);
        const isPinned = index !== -1;
        return {
          value: isPinned ? 0 : 1,
          content: (
            <Tooltip align="topMiddle" content={t('in-sdk:dashboard.customMetricsV2.customMetricsContent')}>
              <SvgIcon
                type={isPinned ? 'lib_fancy_checkbox_checked' : 'lib_fancy_checkbox_unchecked'}
                className={isPinned ? locals.pinned : locals.unpinned}
                size="xxs"
                onClick={() => {
                  if (isPinned) {
                    row.setPinnedMetrics(row.pinnedMetrics.filter(v => v !== row.key));
                  } else {
                    row.setPinnedMetrics(row.pinnedMetrics.concat(row.key));
                  }
                }}
              />
            </Tooltip>
          )
        };
      }
    }
  },
  {
    title: t('in-sdk:dashboard.customMetricsV2.customMetricsTitleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-sdk:dashboard.customMetricsV2.customMetricsTitleValue'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return (row.metrics[row.tableMetric] || row.metrics[0]).name;
      },
      getContent(value, row) {
        return (row.metrics[row.tableMetric] || row.metrics[0]).formatter(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
