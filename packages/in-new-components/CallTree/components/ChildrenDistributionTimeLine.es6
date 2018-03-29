import React from 'react';

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
  const networkTime = span.networkTime || 0;
  const spanWidthInPercent = scale.getRange(span.duration) - scale.getRange(0);
  let networkWidthInPercent = scale.getRange(span.duration + networkTime) - scale.getRange(0);
  networkWidthInPercent = networkWidthInPercent / spanWidthInPercent * 100;

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
      <span className={locals.spanDuration}>{span.duration}ms</span>
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
