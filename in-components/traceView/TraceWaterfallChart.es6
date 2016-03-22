import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import createScale from 'in-services/scale';

import './TraceWaterfallChart.less';

const block = 'in-trace-waterfall-chart';

const TraceWatterfallSpan = ({span, scale}) => {
  const left = scale.getRange(span.get('start'));
  const right = scale.getRange(span.get('start') + span.get('duration'));
  return (
    <div>
      <div className={block + '__span'}
           style={{left: `${left}%`}}>
        <div className={block + '__span-block'}
             style={{width: `${right - left}%`}}>
        </div>
        {msZeroDecimalPlaces(span.get('duration'))}: {span.get('name')}
      </div>

      {span.get('childSpans').toArray().map(childSpan =>
        <TraceWatterfallSpan key={childSpan.get('spanId')}
                             span={childSpan}
                             scale={scale}/>
      )}
    </div>
  );
};

export default React.createClass({
  displayName: 'TraceWaterfallChart',

  mixins: [PureRenderMixin],

  propTypes: {
    trace: irpt.map.isRequired
  },

  render() {
    const domain = this.getDomainRange();
    const scale = createScale();
    scale.setRangeFrom(0);
    scale.setRangeTo(100);
    scale.setDomainFrom(domain[0]);
    scale.setDomainTo(domain[1]);

    return (
      <div className={block}>
        <TraceWatterfallSpan span={this.props.trace}
                             scale={scale}/>
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
  }
});
