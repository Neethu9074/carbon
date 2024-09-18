/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { convertToCallLogs } from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/utils';
import { convertLogEventsToLogs } from 'in-applications/analyze/components/TraceDetails/components/CallTree/logEvents';
import CallTooltipContent from 'in-applications/analyze/components/TraceDetails/components/CallTooltipContent';
import { isCallNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import LogTooltipContent from 'in-applications/analyze/components/TraceDetails/components/LogTooltipContent';
import { isFakeRootCall } from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import LogIndicator from 'in-applications/analyze/components/TraceDetails/components/LogIndicator';
import { useLogsInCallsContext } from 'in-logging/components/TraceDetails/LogsInCallsContext';
import { filterOtelLogs } from 'in-logging/components/TraceDetails/utils';
import { latencyFixed } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';

import locals from './ChildrenDistributionTimeLine.mless';

export default function ChildrenDistributionTimeLine(props) {
  const { call, getColor, scale, onCallClicked, onSubCallClicked } = props;
  const { items: loggingLogItems } = useLogsInCallsContext();

  const nonSpanLogs = convertToCallLogs(loggingLogItems.filter(filterOtelLogs(call)));
  const spanLogs = call.children?.filter(isCallNode).filter(subCall => subCall.model === 'LOG') ?? [];

  const logs = [...nonSpanLogs, ...spanLogs];

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
      {call.children.filter(isCallNode).map((subCall, i) => (
        <CallIndicator
          onClick={onSubCallClicked}
          key={i}
          call={subCall}
          scale={scale}
          getColor={getColor}
          className={locals.subCallIndicator}
        />
      ))}
      {logs.map((log, i) => (
        <LogIndicators key={i} {...props} parentCall={call} log={log} />
      ))}
      {convertLogEventsToLogs(call.logEvents).map((log, i) => (
        <LogIndicators key={i} {...props} parentCall={call} log={log} />
      ))}
    </div>
  );
}

function ParentCallIndicator({ call, scale, getColor, onClick }) {
  const duration = call.batchSize > 1 ? call.minSelfTime : call.duration;
  const left = scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeFrom() : scale.getRange(call.start);
  const width =
    scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeTo() : scale.getRange(call.start + duration) - left;

  return (
    <Tooltip
      themeStyle="light"
      content={<CallTooltipContent call={call} getColor={getColor} />}
      align="topMiddle"
      overwriteBlock
      forceTheme
    >
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
  const duration = call.batchSize > 1 ? call.minSelfTime : call.duration;
  const networkTime = call.networkTime || 0;
  const processingStartTime = call.start + networkTime / 2;
  const processingEndTime = call.start + duration - networkTime / 2;
  const processingDuration = processingEndTime - processingStartTime;

  const processingWidthInPercent = (processingDuration / duration) * 100;

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
  const duration = call.batchSize > 1 ? call.minSelfTime : call.duration;

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
        {latencyFixed.compact(duration)}
      </span>
    </div>
  );
}

function CallIndicator({ call, scale, getColor, onClick }) {
  const left = scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeFrom() : scale.getRange(call.start);
  const duration = call.batchSize > 1 ? call.minSelfTime : call.duration;

  const width =
    scale.getDomainFrom() === scale.getDomainTo() ? scale.getRangeTo() : scale.getRange(call.start + duration) - left;

  return (
    <Tooltip
      themeStyle="light"
      content={<CallTooltipContent call={call} getColor={getColor} />}
      align="topMiddle"
      overwriteBlock
      forceTheme
    >
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
    <Tooltip themeStyle="light" forceTheme content={getTooltipContent(log)} align="auto">
      <LogIndicator {...props} inTimeline left={left} />
    </Tooltip>
  );
}

function getTooltipContent(log) {
  return <LogTooltipContent log={log} />;
}
