/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import CallTooltipContent from 'in-analyze/TraceDetail/components/CallTooltipContent';
import LogTooltipContent from 'in-analyze/TraceDetail/components/LogTooltipContent';
import LogIndicator from 'in-analyze/TraceDetail/components/LogIndicator';
import { isFakeRootCall } from 'in-analyze/TraceDetail/shared/CallHelper';
import { latencyFixed } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';

import locals from './ChildrenDistributionTimeLine.mless';

export default function ChildrenDistributionTimeLine(props) {
  const { call, getColor, scale, onCallClicked, onSubCallClicked } = props;

  return (
    <div className={locals.childrenDistributionTimeLine}>
      <div className={locals.line} />
      <ParentCallIndicator
        key={call.id}
        call={call}
        scale={scale}
        getColor={getColor}
        onClick={isFakeRootCall(call) ? null : onCallClicked}
      />
      {call.children.map((subCall, i) => (
        <CallIndicator
          onClick={onSubCallClicked}
          key={i}
          call={subCall}
          scale={scale}
          getColor={getColor}
          className={locals.subCallIndicator}
        />
      ))}
      {call.children
        .filter(subCall => subCall.model === 'LOG')
        .map((subCall, i) => (
          <LogIndicators key={i} {...props} parentCall={call} log={subCall} />
        ))}
    </div>
  );
}

function ParentCallIndicator({ call, scale, getColor, onClick }) {
  const left = scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeFrom() : scale.getRange(call.start);
  const width =
    scale.getDomainFrom() === scale.getDomainTo()
      ? scale.getRangeTo()
      : scale.getRange(call.start + call.duration) - left;

  return (
    <Tooltip themeStyle="light" content={<CallTooltipContent call={call} getColor={getColor} />} align="topMiddle">
      <div
        style={{
          left: `${left}%`,
          width: `${width}%`
        }}
        className={classNames({
          [locals.callIndicator]: true,
          [locals.clickable]: onClick != null
        })}
        onClick={onClick ? () => onClick(call) : () => {}}
      >
        <div className={locals.networkTimeBar} style={{ background: getColor(call) }} />
        <ProcessingTime call={call} getColor={getColor} />
        <CallDurationLabel call={call} scale={scale} />
      </div>
    </Tooltip>
  );
}

function ProcessingTime({ call, getColor }) {
  const networkTime = call.networkTime || 0;
  const processingStartTime = call.start + networkTime / 2;
  const processingEndTime = call.start + call.duration - networkTime / 2;
  const processingDuration = processingEndTime - processingStartTime;

  const processingWidthInPercent = (processingDuration / call.duration) * 100;

  return (
    <div
      style={{
        background: getColor(call),
        width: `${processingWidthInPercent}%`,
        left: `${(100 - processingWidthInPercent) / 2}%`
      }}
      className={locals.processingTime}
    />
  );
}

function CallDurationLabel({ call }) {
  // const positionOnAxisInPercent = scale.getRange(call.start + call.duration);

  return (
    <div
      className={classNames({
        [locals.callDurationWrapper]: true,
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

function CallIndicator({ call, scale, getColor, onClick }) {
  const left = scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeFrom() : scale.getRange(call.start);
  const width =
    scale.getDomainFrom() === scale.getDomainTo()
      ? scale.getRangeTo()
      : scale.getRange(call.start + call.duration) - left;

  return (
    <Tooltip themeStyle="light" content={<CallTooltipContent call={call} getColor={getColor} />} align="topMiddle">
      <div
        style={{
          left: `${left}%`,
          width: `${width}%`,
          background: getColor(call)
        }}
        className={classNames(locals.subCallIndicator, locals.clickable)}
        onClick={() => onClick(call)}
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
