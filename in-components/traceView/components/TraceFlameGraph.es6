import React from 'react';

import {getStart, getEnd, getDepth} from 'in-components/traceView/util';
import {highlightSpanId} from 'in-components/traceView/traceViewStore';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import {getLabel, getCategory, getDirection} from 'in-sdk/tracing';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-charts/scale';

import './TraceFlameGraph.less';

const block = 'in-trace-view-flame-graph';
const margin = 3;
const height = 6;


function FlameGraphElement({span, currentDepth, scale}) {
  const top = (currentDepth - 1) * (margin + height);
  const left = scale.getRange(span.get('start'));
  // reduce by 0.1 to give it some wiggle room between two adjacent spans
  const width = scale.getRange(span.get('start') + span.get('duration')) - left - 0.1;
  let color = spanCategoryColors[getCategory(span)];
  if (span.get('error')) {
    color = 'red';
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
        <Tooltip content='Network'>
          <div className={`${block}__network`}
               style={{
                 top: `${top - 2}px`,
                 left: `${left}%`,
                 width: `${width}%`
               }}
               onClick={() => highlightSpanId(span.get('spanId'))}/>
        </Tooltip>
      : null}

      <Tooltip content={getLabel(span)}>
        <div className={`${block}__element`}
             style={{
               top: `${top}px`,
               left: `${left}%`,
               width: `${width}%`,
               background: color
             }}
             onClick={() => highlightSpanId(span.get('spanId'))}/>
      </Tooltip>
    </div>
  );
}


export default function TraceFlameGraph({trace}) {
  const x = createScale();
  x.setRangeFrom(0);
  x.setRangeTo(100);
  x.setDomainFrom(getStart(trace));
  x.setDomainTo(getEnd(trace));

  const depth = getDepth(trace);
  const chartHeight = depth * (margin + height) - margin;

  return (
    <div style={{
           height: `${chartHeight}px`
         }}
         className={block}>
      <FlameGraphElement span={trace}
                         currentDepth={1}
                         scale={x} />
    </div>
  );
}
