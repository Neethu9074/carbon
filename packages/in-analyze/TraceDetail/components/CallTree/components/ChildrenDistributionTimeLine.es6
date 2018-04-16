import React from 'react';

import CallTooltipContent from 'in-analyze/TraceDetail/components/CallTooltipContent/CallTooltipContent';
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
  const left = scale.getRange(call.start);
  const width = scale.getRange(call.start + call.duration) - scale.getRange(call.start);

  return (
    <Tooltip content={<CallTooltipContent call={call} />} align="topMiddle">
      <div
        style={{
          left: `${left}%`,
          width: `${width}%`,
          background: getColor(call)
        }}
        className={locals.callIndicator}
        onClick={() => onClick(call)}
      >
        <NetworkTime call={call} scale={scale} getColor={getColor}>
          <ErrorIndicator className={locals.errorIndicator} errorCount={call.errorCount} />
        </NetworkTime>
      </div>
    </Tooltip>
  );
}

function NetworkTime({ scale, call, getColor, children }) {
  let networkWidthInPercent = 100;
  if (call.duration > 0 && call.networkTime > 0) {
    const networkTime = call.networkTime;
    const callWidthInPercent = scale.getRange(call.duration) - scale.getRange(0);
    networkWidthInPercent = scale.getRange(call.duration + networkTime) - scale.getRange(0);
    networkWidthInPercent = networkWidthInPercent / callWidthInPercent * 100;
  }

  const positionOnAxisInPercent = scale.getRange(call.start + call.duration);

  return (
    <div
      style={{
        width: `${networkWidthInPercent}%`,
        left: `${-(networkWidthInPercent - 100) / 2}%`
      }}
      className={locals.networkTime}
    >
      <div style={{ background: getColor(call) }} className={locals.networkTimeBar} />
      <div
        className={evaluateClassNames({
          [locals.callDurationWrapper]: true,
          [locals.leftAlignedCallDurationWrapper]: positionOnAxisInPercent < 50,
          [locals.rightAlignedCallDurationWrapper]: positionOnAxisInPercent >= 50
        })}
      >
        <span
          className={evaluateClassNames({
            [locals.callDuration]: true,
            [locals.leftAlignedCallDuration]: positionOnAxisInPercent < 50,
            [locals.rightAlignedCallDuration]: positionOnAxisInPercent >= 50
          })}
        >
          {millis.fixedCompact(call.duration)}
        </span>
      </div>
      {children}
    </div>
  );
}

function CallIndicator({ call, scale, getColor, onClick }) {
  const left = scale.getRange(call.start);
  const width = scale.getRange(call.start + call.duration) - scale.getRange(call.start);

  return (
    <Tooltip content={<CallTooltipContent call={call} />} align="topMiddle">
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
