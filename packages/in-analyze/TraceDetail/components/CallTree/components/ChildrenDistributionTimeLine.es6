import React from 'react';

import CallTooltipContent from 'in-analyze/TraceDetail/components/CallTooltipContent';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import { evaluateClassNames } from 'in-services/util/classnames';
import { millis } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';

import locals from './ChildrenDistributionTimeLine.mless';

export default function ChildrenDistributionTimeLine({ call, getColor, scale, onCallClicked, onSubCallClicked }) {
  return (
    <div className={locals.childrenDistributionTimeLine}>
      <div className={locals.line} />
      <ParentCallIndicator key={call.id} call={call} scale={scale} getColor={getColor} onClick={onCallClicked} />
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
        className={locals.callIndicator}
        onClick={() => onClick(call)}
      >
        <div className={locals.networkTimeBar} style={{ background: getColor(call) }} />
        <ProcessingTime call={call} getColor={getColor} />
        <CallDurationLabel call={call} scale={scale} />
        <ErrorIndicator className={locals.errorIndicator} errorCount={call.errorCount} />
      </div>
    </Tooltip>
  );
}

function ProcessingTime({ call, getColor }) {
  const networkTime = call.networkTime || 0;
  const processingStartTime = call.start + networkTime / 2;
  const processingEndTime = call.start + call.duration - networkTime / 2;
  const processingDuration = processingEndTime - processingStartTime;

  const processingWidthInPercent = processingDuration / call.duration * 100;

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
      className={evaluateClassNames({
        [locals.callDurationWrapper]: true,
        [locals.leftAlignedCallDurationWrapper]: true,
        [locals.rightAlignedCallDurationWrapper]: false
      })}
    >
      <span
        className={evaluateClassNames({
          [locals.callDuration]: true,
          [locals.leftAlignedCallDuration]: true,
          [locals.rightAlignedCallDuration]: false
        })}
      >
        {millis.fixedCompact(call.duration)}
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
        className={locals.subCallIndicator}
        onClick={() => onClick(call)}
      />
    </Tooltip>
  );
}
