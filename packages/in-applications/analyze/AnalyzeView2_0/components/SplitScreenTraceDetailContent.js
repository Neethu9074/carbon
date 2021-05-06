/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import BatchingIndicator from 'in-analyze/components/BatchingIndicator/BatchingIndicator';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import { getTypeTextByCount } from 'in-applications/analyze/metrics';
import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './SplitScreenTraceDetailContent.mless';

const typePerDataSource = {
  calls: 'call',
  traces: 'trace'
};

export default function SplitScreenTraceDetailContent({ dataSource, ungroupedViewConfiguration, ...props }) {
  const type = typePerDataSource[dataSource];
  const item = props[type];
  const { label, duration, errorCount, batchCount } = item;
  const timestamp = item[ungroupedViewConfiguration.timestampName];
  const severity = errorCount >= 1 ? 10 : 0;
  return (
    <div className={locals.wrapper}>
      <Tooltip
        content={severity === 0 ? t('in-applications:analyze.noErrors') : t('in-applications:analyze.containsErrors')}
        align="rightMiddle"
      >
        <div className={locals.erroneous}>
          <HealthDot severity={severity} iconSize={10} />
        </div>
      </Tooltip>
      <KeyValue
        value={label}
        label={
          <>
            <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time> &nbsp;{'  '}
            {latencyFixed.compact(duration)}
            <BatchingIndicator
              batchCount={batchCount}
              tooltipContent={t('in-applications:analyze.listBatchTypeTooltip', {
                type: getTypeTextByCount(type, 1),
                batchCount: batchCount,
                types: getTypeTextByCount(type, batchCount)
              })}
              tooltipAlign="rightMiddle"
              noTopPosition
            />
          </>
        }
        inverted
        accentuated
      />
    </div>
  );
}
