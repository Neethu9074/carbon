/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  TOTAL_TIME_LABEL,
  NETWORK_TIME_LABEL,
  SELF_TIME_LABEL,
  WAITING_TIME_LABEL
} from 'in-analyze/TraceDetail/components/TimingConstants';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { isUnknownTypeSpan } from 'in-analyze/TraceDetail/shared/CallHelper';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import { hasOnlyExitSpan } from 'in-analyze/TraceDetail/shared/CallHelper';
import { latencyFixed } from 'in-services/formatters/number';
import { shorten } from 'in-services/util/string';
import Pill from 'in-new-components/Pill';
import { t } from 'in-i18n';

import locals from './CallTooltipContent.mless';

export default function CallTooltipContent({ call }) {
  const waitingTime = hasOnlyExitSpan(call) ? null : call.duration - (call.minSelfTime || 0) - (call.networkTime || 0);
  const values = [
    {
      label: SELF_TIME_LABEL,
      duration: call.minSelfTime,
      totalDuration: call.duration
    },
    {
      label: NETWORK_TIME_LABEL,
      duration: call.networkTime,
      totalDuration: call.duration
    },
    {
      label: WAITING_TIME_LABEL,
      duration: waitingTime,
      totalDuration: call.duration
    }
  ];

  return (
    <div className={locals.content}>
      <div className={locals.heading}>
        {call.endpoint && !isUnknownTypeSpan(call) && (
          <Pill kind="light" color={getEndpointColor(call.endpoint.type)}>
            {call.endpoint.type}
          </Pill>
        )}
        {call.batchSize > 1 && (
          <Pill className={locals.batchSizeIndicator} kind="lighter">
            {call.batchSize}
          </Pill>
        )}
        <span className={locals.headingLabel}>{shorten(call.label, 32)}</span>
      </div>
      {call.errorCount > 0 && (
        <div className={locals.errorCount}>
          {t('in-analyze:traceDetail.components.callTooltipContent.numbersOfErrors', { count: call.errorCount })}
        </div>
      )}
      <TimingValueList values={values} />
      <div className={locals.horizontalLine} />
      <TimingValueTotal value={call.duration} />
    </div>
  );
}

function TimingValueList({ values }) {
  return (
    <ul className={locals.timingValueList}>
      {values.map(value => {
        const { label, duration, totalDuration } = value;

        const durationValue = duration == null ? valueMissingPlaceholder : `${latencyFixed.compact(duration)}`;
        const durationInPercent =
          totalDuration && duration == null ? null : '(' + (((duration / totalDuration) * 100) | 0) + '%)';

        return (
          <li key={label} className={locals.timingValue}>
            <span className={locals.label}>{label}</span>
            <span>
              <span className={locals.duration}>{durationValue}</span>
              <span className={locals.durationInPercent}>{durationInPercent}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function TimingValueTotal({ value }) {
  return (
    <div className={locals.timingValueTotal}>
      <span>{TOTAL_TIME_LABEL}</span>
      <span>{latencyFixed.compact(value)}</span>
    </div>
  );
}
