import irpt from 'react-immutable-proptypes';
import React from 'react';

import {setSelectedSpanId, selectedSpanId$, clearSpanSelection} from 'in-stores/traces';
import TraceWaterfallAxis from 'in-components/traceView/components/TraceWaterfallAxis';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/tracing';

import './TraceWaterfallChart.less';


const MIN_AXIS_DURATION = 1;
const block = 'in-trace-waterfall-chart';

export default connectTo({
  selectedSpanId: selectedSpanId$
}, TraceWaterfallChart);

function TraceWaterfallChart({trace, selectedSpanId}) {
  const domain = getDomainRange(trace);
  const scale = createScale();
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(domain[0]);
  scale.setDomainTo(domain[1]);

  let fullDomain = scale.getDomainTo() - scale.getDomainFrom();
  // if the hole trace is < 1ms long, set it to 1ms to get a better formatting
  if (fullDomain < MIN_AXIS_DURATION) {
    fullDomain = MIN_AXIS_DURATION;
    scale.setDomainTo(scale.getDomainFrom() + MIN_AXIS_DURATION * 2);
  }
  const axisConfig = getAxisConfig(fullDomain);
  const ticks = getTickPositions(scale, axisConfig, true);

  return (
    <div className={block}>
      <TraceWaterfallAxis ticks={ticks}
                          axisConfig={axisConfig}
                          fullDomain={fullDomain} />
      <TraceWaterfallSpan span={trace}
                           scale={scale}
                           selectedSpanId={selectedSpanId} />
    </div>
  );
}

function getDomainRange(trace) {
  const domain = [Number.MAX_VALUE, Number.MIN_VALUE];
  updateDomain(trace);
  return domain;

  function updateDomain(span) {
    const start = span.get('start');
    domain[0] = Math.min(domain[0], start);
    domain[1] = Math.max(domain[1], start + span.get('duration'));
    span.get('childSpans').forEach(updateDomain);
  }
}

function TraceWaterfallSpan({span, scale, selectedSpanId}) {
  const left = scale.getRange(span.get('start'));
  const right = scale.getRange(span.get('start') + span.get('duration'));
  const selected = span.get('spanId') === selectedSpanId;
  const spanHasError = span.get('error');

  let classes = block + '__span';
  if (spanHasError) {
    classes += '-error';
  }
  if (selected) {
    classes += ' ' + classes + '--selected';
  }

  const onClick = selected ? clearSpanSelection : () => setSelectedSpanId(span.get('spanId'));

  return (
    <div>
      <div className={classes}
           style={{
             left: `${left}%`,
             width: `${right - left}%`
           }}
           onClick={onClick}>
        <div className={
               block + '__span-block' + (spanHasError ? '-error' : '')
             }/>
        <span>
          {msZeroDecimalPlaces(span.get('duration'))}: {getLabel(span)}
        </span>
      </div>

      {span.get('childSpans').toArray().map(childSpan =>
        <TraceWaterfallSpan key={childSpan.get('spanId')}
                             span={childSpan}
                             scale={scale}
                             selectedSpanId={selectedSpanId} />
      )}
    </div>
  );
}

TraceWaterfallChart.propTypes = {
  trace: irpt.map.isRequired,
  selectedSpanId: React.PropTypes.string
};
