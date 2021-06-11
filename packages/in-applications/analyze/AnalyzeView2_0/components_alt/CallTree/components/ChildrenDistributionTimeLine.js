/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import CallTooltipContent from 'in-applications/analyze/components/TraceDetails/components/CallTooltipContent';
import LogTooltipContent from 'in-applications/analyze/components/TraceDetails/components/LogTooltipContent';
import LogIndicator from 'in-applications/analyze/components/TraceDetails/components/LogIndicator';
import { latencyFixed } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';

import locals from './ChildrenDistributionTimeLine.mless';

export default function ChildrenDistributionTimeLine(props) {
  const { call, getColor, scale, showSubCallBars } = props;

  return (
    <div className={locals.childrenDistributionTimeLine}>
      <ParentCallIndicator
        key={call.id}
        call={call}
        scale={scale}
        getColor={getColor}
        showSubCallBars={showSubCallBars}
      />
      {showSubCallBars &&
        call.children.map((subCall, i) => (
          <CallIndicator key={i} call={subCall} scale={scale} getColor={getColor} className={locals.subCallIndicator} />
        ))}
      {call.children
        .filter(subCall => subCall.model === 'LOG')
        .map((subCall, i) => (
          <LogIndicators key={i} {...props} parentCall={call} log={subCall} />
        ))}
    </div>
  );
}

function ParentCallIndicator({ call, scale, getColor, showSubCallBars }) {
  const left = scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeFrom() : scale.getRange(call.start);
  const width =
    scale.getDomainFrom() === scale.getDomainTo()
      ? scale.getRangeTo()
      : scale.getRange(call.start + call.duration) - left;

  return (
    <Tooltip themeStyle="light" content={<CallTooltipContent call={call} getColor={getColor} />} align="topMiddle">
      <div
        className={classNames({
          [locals.callIndicator]: true,
          [locals.smallCallIndicator]: showSubCallBars
        })}
        style={{
          left: `${left}%`,
          width: `${width}%`
        }}
      >
        <Bars call={call} getColor={getColor} />
        <CallDurationLabel call={call} scale={scale} small={showSubCallBars} />
      </div>
    </Tooltip>
  );
}

function Bars({ call, getColor }) {
  const background = getColor(call);

  const networkTime = call.networkTime || 0;
  const processingStartTime = call.start + networkTime / 2;
  const processingEndTime = call.start + call.duration - networkTime / 2;
  const processingDuration = processingEndTime - processingStartTime;

  if (call.duration <= 0 || processingDuration === call.duration) {
    return <div className={locals.bar} style={{ background }} />;
  }

  const processingWidthInPercent = (processingDuration / call.duration) * 100;

  return (
    <>
      <div className={locals.networkTimeBar} style={{ background }} />
      <div
        style={{
          background,
          width: `${processingWidthInPercent}%`,
          left: `${(100 - processingWidthInPercent) / 2}%`
        }}
        className={locals.processingTime}
      />
    </>
  );
}

function CallDurationLabel({ call, small }) {
  return (
    <div
      className={classNames({
        [locals.callDurationWrapper]: true,
        [locals.smallCallDurationWrapper]: small,

        [locals.leftAlignedCallDurationWrapper]: true,
        [locals.rightAlignedCallDurationWrapper]: false
      })}
    >
      <span
        className={classNames({
          [locals.callDuration]: true,
          [locals.leftAlignedCallDuration]: true,
          [locals.rightAlignedCallDuration]: false
        })}
      >
        {latencyFixed.compact(call.duration)}
      </span>
    </div>
  );
}

function CallIndicator({ call, scale, getColor }) {
  const left = scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeFrom() : scale.getRange(call.start);
  const width =
    scale.getDomainFrom() === scale.getDomainTo()
      ? scale.getRangeTo()
      : scale.getRange(call.start + call.duration) - left;

  return (
    <Tooltip themeStyle="light" content={<CallTooltipContent call={call} getColor={getColor} />} align="topMiddle">
      <div
        className={locals.subCallIndicator}
        style={{
          left: `${left}%`,
          width: `${width}%`,
          background: getColor(call)
        }}
      />
    </Tooltip>
  );
}

function LogIndicators(props) {
  const { log, scale } = props;

  const left = scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeFrom() : scale.getRange(log.start);

  return (
    <Tooltip themeStyle="light" content={getTooltipContent(log)} align="topMiddle">
      <LogIndicator {...props} inTimeline left={left} />
    </Tooltip>
  );
}

function getTooltipContent(log) {
  if (!role.canViewLogs) return null;
  return <LogTooltipContent log={log} />;
}
