import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {setSelectedSpanId, selectedSpanId$, clearSpanSelection} from 'in-stores/traces';
import TraceWaterfallAxis from 'in-components/traceView/components/TraceWaterfallAxis';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {getAxisConfig} from 'in-charts/timeFormatting';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/tracing';

import './TraceWaterfallChart.less';

const block = 'in-trace-waterfall-chart';


const TraceWatterfallSpan = ({span, scale, selectedSpanId}) => {
  const left = scale.getRange(span.get('start'));
  const right = scale.getRange(span.get('start') + span.get('duration'));
  const selected = span.get('spanId') === selectedSpanId;

  let classes = block + '__span';
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
        <div className={block + '__span-block'}>
        </div>
        {msZeroDecimalPlaces(span.get('duration'))}: {getLabel(span)}
      </div>

      {span.get('childSpans').toArray().map(childSpan =>
        <TraceWatterfallSpan key={childSpan.get('spanId')}
                             span={childSpan}
                             scale={scale}
                             selectedSpanId={selectedSpanId} />
      )}
    </div>
  );
};


export default connectTo({
    selectedSpanId: selectedSpanId$
  }, React.createClass({
    displayName: 'TraceWaterfallChart',

    mixins: [PureRenderMixin],

    propTypes: {
      trace: irpt.map.isRequired,
      selectedSpanId: React.PropTypes.string
    },

    render() {
      const domain = this.getDomainRange();
      const scale = createScale();
      scale.setRangeFrom(0);
      scale.setRangeTo(100);
      scale.setDomainFrom(domain[0]);
      scale.setDomainTo(domain[1]);
      const axisConfig = getAxisConfig(scale.getDomainTo() - scale.getDomainFrom());
      const ticks = this.getTickPositions(scale, axisConfig);

      return (
        <div className={block}>
          <TraceWaterfallAxis ticks={ticks}
                              axisConfig={axisConfig} />
          <TraceWatterfallSpan span={this.props.trace}
                               scale={scale}
                               selectedSpanId={this.props.selectedSpanId} />
        </div>
      );
    },

    getDomainRange() {
      const domain = [Number.MAX_VALUE, Number.MIN_VALUE];
      updateDomain(this.props.trace);
      return domain;

      function updateDomain(span) {
        const start = span.get('start');
        domain[0] = Math.min(domain[0], start);
        domain[1] = Math.max(domain[1], start + span.get('duration'));
        span.get('childSpans').forEach(updateDomain);
      }
    },

    getTickPositions(scale, axisConfig) {
      // special case: Trace with 0 time.
      if (scale.getDomainFrom() === scale.getDomainTo()) {
        return [{
          range: scale.getRangeFrom(),
          domain: scale.getDomainFrom()
        }];
      }

      const ticks = [];
      const width = scale.getRangeTo();
      const start = scale.getDomainFrom();

      let lastTickDomain = 0;
      let lastTickRange = scale.getRange(lastTickDomain + start);

      while (lastTickRange <= width) {
        ticks.push({
          range: lastTickRange,
          domain: lastTickDomain + start
        });

        lastTickDomain += axisConfig.stepSize;
        lastTickRange = scale.getRange(lastTickDomain + start);
      }

      return ticks;
    }
}));
