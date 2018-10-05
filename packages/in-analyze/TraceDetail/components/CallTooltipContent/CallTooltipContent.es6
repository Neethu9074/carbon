import React, { Fragment } from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { hasOnlyExitSpan } from 'in-analyze/TraceDetail/shared/CallHelper.es6';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import {
  TOTAL_TIME_LABEL,
  NETWORK_TIME_LABEL,
  SELF_TIME_LABEL,
  WAITING_TIME_LABEL,
  WAITING_TIME_COLOR,
  NETWORK_TIME_COLOR_OPACITY
} from 'in-analyze/TraceDetail/components/TimingConstants.es6';
import { millis } from 'in-services/formatters/number';
import { shorten } from 'in-services/util/string';
import Pill from 'in-new-components/Pill';

import locals from './CallTooltipContent.mless';

export default function CallTooltipContent({ call, getColor }) {
  let values = [];

  const waitingTime = hasOnlyExitSpan(call) ? null : call.duration - (call.minSelfTime || 0) - (call.networkTime || 0);

  values.push({
    label: SELF_TIME_LABEL,
    duration: call.minSelfTime,
    totalDuration: call.duration,
    color: getColor(call),
    opacity: 1
  });

  values.push({
    label: NETWORK_TIME_LABEL,
    duration: call.networkTime,
    totalDuration: call.duration,
    color: getColor(call),
    opacity: NETWORK_TIME_COLOR_OPACITY
  });

  values.push({
    label: WAITING_TIME_LABEL,
    duration: waitingTime,
    totalDuration: call.duration,
    color: WAITING_TIME_COLOR,
    opacity: 1
  });

  return (
    <div className={locals.content}>
      <div className={locals.heading}>
        <span className={locals.headingLabel}>{shorten(call.label, 32)}</span>
        {call.endpoint && (
          <Fragment>
            <Pill kind="light" color={getEndpointColor(call.endpoint.type)}>
              {call.endpoint.type}
            </Pill>
            <TechnologyIndicatorList technologies={call.technologies} showTechnologyLabel={false} />
          </Fragment>
        )}
      </div>
      {call.errorCount > 0 && <div className={locals.errorCount}>{call.errorCount} Errors</div>}
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
        const { label, duration, totalDuration, color, opacity } = value;

        const durationValue = duration == null ? '--' : `${millis.fixedCompact(duration)}`;
        const durationInPercent =
          totalDuration && duration == null ? null : '(' + ((duration / totalDuration * 100) | 0) + '%)';

        return (
          <li key={label} className={locals.timingValue}>
            <span className={locals.label}>
              <div className={locals.colorIndicator} style={{ background: color, opacity }} />
              {label}
            </span>
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
      <span>{millis.fixedCompact(value)}</span>
    </div>
  );
}
