/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import BatchingIndicator from 'in-analyze/components/BatchingIndicator/BatchingIndicator';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './SplitScreenSessionContent.mless';

export default function SplitScreenSessionContent(props) {
  const { beacon, dataSource } = props;
  const { timestamp, duration, errorCount, batchSize } = beacon;
  const formattedDuration = latencyFixed.compact(duration);
  const severity = errorCount >= 1 ? 10 : 0;
  return (
    <div className={locals.wrapper}>
      <Tooltip
        content={severity === 0 ? t('in-mobile-apps:noErrors') : t('in-mobile-apps:containsErrors')}
        align="rightMiddle"
      >
        <div className={locals.erroneous}>
          <HealthDot severity={severity} iconSize={10} />
        </div>
      </Tooltip>
      <KeyValue
        label={
          <>
            <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time> &nbsp;{'  '}
            {formattedDuration}
            <BatchingIndicator
              batchCount={batchSize}
              tooltipContent={t(
                'in-mobile-apps:analyzeView.perBeaconTypeConfigs.httpRequestBatchingIndicatorTooltipContent',
                { size: batchSize }
              )}
              tooltipAlign="rightMiddle"
              noTopPosition
            />
          </>
        }
        value={getValuePerDataSource(beacon, dataSource)}
        inverted
        accentuated
      />
    </div>
  );
}

function getValuePerDataSource(beacon, dataSource) {
  return {
    sessionStart: beacon.sessionId,
    viewChange: beacon.view,
    httpRequest: `${beacon.httpCallMethod} ${beacon.httpCallUrl}`,
    custom: beacon.customEventName
  }[dataSource];
}
