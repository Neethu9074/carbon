import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import ErrorIndicator from 'in-analyze/Analyze/ErrorIndicator';

import locals from './ChildrenDistributionTimeLine.mless';

export default function ChildrenDistributionTimeLine({ span, getColor, scale }) {
  return (
    <div className={locals.childrenDistributionTimeLine}>
      <div className={locals.line} />
      <ParentSpanIndicator key={span.id} span={span} scale={scale} getColor={getColor}>
        <ErrorIndicator className={locals.errorIndicator} errorCount={span.errorCount} />
      </ParentSpanIndicator>
      {span.children.map((childSpan, i) => (
        <SpanIndicator
          key={i}
          span={childSpan}
          scale={scale}
          getColor={getColor}
          className={locals.childSpanIndicator}
        />
      ))}
    </div>
  );
}

function ParentSpanIndicator({ span, scale, getColor, children }) {
  return (
    <div
      style={{
        left: `${scale.getRange(span.start)}%`,
        width: `${scale.getRange(span.duration) - scale.getRange(0)}%`,
        background: getColor(span)
      }}
      className={locals.spanIndicator}
    >
      {<NetworkTime span={span} scale={scale} getColor={getColor} />}
      {children}
    </div>
  );
}

function NetworkTime({ scale, span, getColor }) {
  let networkWidthInPercent = 100;
  if (span.duration > 0 && span.networkTime > 0) {
    const networkTime = span.networkTime;
    const spanWidthInPercent = scale.getRange(span.duration) - scale.getRange(0);
    networkWidthInPercent = scale.getRange(span.duration + networkTime) - scale.getRange(0);
    networkWidthInPercent = networkWidthInPercent / spanWidthInPercent * 100;
  }

  const positionOnAxisInPercent = scale.getRange(span.start + span.duration);

  return (
    <div
      style={{
        width: `${networkWidthInPercent}%`,
        left: `${-(networkWidthInPercent - 100) / 2}%`
      }}
      className={locals.networkTime}
    >
      <div
        style={{
          background: getColor(span)
        }}
        className={locals.networkTimeBar}
      />
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
          {span.duration}ms
        </span>
      </div>
    </div>
  );
}

function SpanIndicator({ span, scale, getColor }) {
  const networkTime = span.networkTime || 0;

  return (
    <div
      style={{
        left: `${scale.getRange(span.start - networkTime / 2)}%`,
        width: `${scale.getRange(span.duration + networkTime) - scale.getRange(0)}%`,
        background: getColor(span)
      }}
      className={locals.childSpanIndicator}
    />
  );
}
