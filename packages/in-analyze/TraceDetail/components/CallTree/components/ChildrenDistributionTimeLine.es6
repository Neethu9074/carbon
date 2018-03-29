import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import ErrorIndicator from 'in-analyze/Analyze/ErrorIndicator';

import locals from './ChildrenDistributionTimeLine.mless';

export default function ChildrenDistributionTimeLine({ call, getColor, scale, onCallClicked }) {
  return (
    <div className={locals.childrenDistributionTimeLine}>
      <div className={locals.line} />
      <ParentCallIndicator key={call.id} call={call} scale={scale} getColor={getColor} />
      {call.children.map((childSpan, i) => (
        <CallIndicator
          onClick={onCallClicked}
          key={i}
          call={childSpan}
          scale={scale}
          getColor={getColor}
          className={locals.childSpanIndicator}
        />
      ))}
    </div>
  );
}

function ParentCallIndicator({ call, scale, getColor }) {
  return (
    <div
      style={{
        left: `${scale.getRange(call.start)}%`,
        width: `${scale.getRange(call.duration) - scale.getRange(0)}%`,
        background: getColor(call)
      }}
      className={locals.spanIndicator}
    >
      <NetworkTime call={call} scale={scale} getColor={getColor}>
        <ErrorIndicator className={locals.errorIndicator} errorCount={call.errorCount} />
      </NetworkTime>
    </div>
  );
}

function NetworkTime({ scale, call, getColor, children }) {
  let networkWidthInPercent = 100;
  if (call.duration > 0 && call.networkTime > 0) {
    const networkTime = call.networkTime;
    const spanWidthInPercent = scale.getRange(call.duration) - scale.getRange(0);
    networkWidthInPercent = scale.getRange(call.duration + networkTime) - scale.getRange(0);
    networkWidthInPercent = networkWidthInPercent / spanWidthInPercent * 100;
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
          [locals.spanDurationWrapper]: true,
          [locals.leftAlignedSpanDurationWrapper]: positionOnAxisInPercent < 50,
          [locals.rightAlignedSpanDurationWrapper]: positionOnAxisInPercent >= 50
        })}
      >
        <span
          className={evaluateClassNames({
            [locals.spanDuration]: true,
            [locals.leftAlignedSpanDuration]: positionOnAxisInPercent < 50,
            [locals.rightAlignedSpanDuration]: positionOnAxisInPercent >= 50
          })}
        >
          {call.duration}ms
        </span>
      </div>
      {children}
    </div>
  );
}

function CallIndicator({ call, scale, getColor, onClick }) {
  const networkTime = call.networkTime || 0;

  return (
    <div
      style={{
        left: `${scale.getRange(call.start - networkTime / 2)}%`,
        width: `${scale.getRange(call.duration + networkTime) - scale.getRange(0)}%`,
        background: getColor(call)
      }}
      className={locals.childSpanIndicator}
      onClick={() => onClick(call)}
    />
  );
}
