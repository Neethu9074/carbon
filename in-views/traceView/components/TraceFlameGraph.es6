import React from 'react';

import {highlightSpanId} from 'in-views/traceView/stores/highlightedSpan';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import {getLabel, getCategory, getDirection} from 'in-sdk/tracing';
import {getStart, getEnd} from 'in-views/traceView/util';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-charts/scale';

import './TraceFlameGraph.less';

const block = 'in-trace-view-flame-graph';
const margin = 3;
const height = 7;
const timeAxisOffset = 16;
const tooltipAlignment = 'topMiddle';

function FlameGraphElement({span, currentDepth, scale}) {
  const top = (currentDepth - 1) * (margin + height);
  const left = scale.getRange(span.get('start'));
  // reduce by 0.1 to give it some wiggle room between two adjacent spans
  const width = scale.getRange(span.get('start') + span.get('duration')) - left - 0.1;
  const color = spanCategoryColors[getCategory(span)];

  let classesForSpanElement = `${block}__element`;
  if (span.get('error')) {
    classesForSpanElement = `${classesForSpanElement} ${block}__element--error`;
  }

  return (
    <div>
      {span.get('childSpans').toArray().map(childSpan =>
        <FlameGraphElement key={childSpan.get('spanId')}
                           span={childSpan}
                           currentDepth={currentDepth + 1}
                           scale={scale} />
      )}

      {getDirection(span) === 'entry' && currentDepth > 1 ?
        <Tooltip content='Network and Serialization'
                 align={tooltipAlignment}>
          <div className={`${block}__network`}
               style={{
                 top: `${top - 1}px`,
                 left: `${left}%`,
                 width: `${width}%`
               }}
               onClick={() => onSpanClick(span)} />
        </Tooltip>
      : null}

      <Tooltip content={getLabel(span)}
               align={tooltipAlignment}>
        <div className={classesForSpanElement}
             style={{
               top: `${top}px`,
               left: `${left}%`,
               width: `${width}%`,
               background: color
             }}
             onClick={() => onSpanClick(span)} />
      </Tooltip>
    </div>
  );
}


export default function TraceFlameGraph({trace}) {
  const start = getStart(trace);
  let end = getEnd(trace);
  if (start === end) {
    end++;
  }

  const x = createScale();
  x.setRangeFrom(0);
  x.setRangeTo(100);
  x.setDomainFrom(start);
  x.setDomainTo(end);

  const depth = getMaxSpanNestingDepth(trace);
  const chartHeight = depth * (margin + height) - margin;
  const axisConfig = getAxisConfig(end - start);
  const tickPositions = getTickPositions(x, axisConfig, true);

  return (
    <div style={{
           height: `${chartHeight + timeAxisOffset}px`
         }}
         className={block}>
      <div className={`${block}__element-wrapper`}>
        <TimeAxis tickPositions={tickPositions}
                  axisConfig={axisConfig}
                  start={start}
                  chartHeight={chartHeight} />

        <FlameGraphElement span={trace}
                           currentDepth={1}
                           scale={x} />
      </div>
    </div>
  );
}


function getMaxSpanNestingDepth(span) {
  let maxDepth = 1;

  span.get('childSpans').forEach(childSpan => {
    maxDepth = Math.max(maxDepth, getMaxSpanNestingDepth(childSpan) + 1);
  });

  return maxDepth;
}


function TimeAxis({tickPositions, axisConfig, start, chartHeight}) {
  return (
    <div className={`${block}__time-axis`}
         style={{
           height: `${chartHeight + timeAxisOffset}px`
         }}>
      {tickPositions.map(position =>
        <div style={{
               left: `${position.range}%`
             }}
             className={`${block}__time-axis-tick`}
             key={position.range}>
          {axisConfig.relativeFormatter(position.domain - start)}
        </div>
      )}
    </div>
  );
}


function onSpanClick(span) {
  const spanId = span.get('spanId');
  highlightSpanId(spanId);
  const scrollElement = document.querySelector('.in-trace-view-tree');
  const spanElement = document.getElementById(`span-${spanId}`);
  if (!scrollElement || !spanElement) {
    return;
  }

  scrollElement.scrollTop = spanElement.offsetTop;
}
