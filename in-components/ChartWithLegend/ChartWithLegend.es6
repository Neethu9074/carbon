import irpt from 'react-immutable-proptypes';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {timeframeShape} from 'in-stores/timeline';
import {currentRollup$} from 'in-stores/metric';

import ChartLegend from '../ChartLegend';
import Chart from '../Chart';

import './ChartWithLegend.less';

const rpt = React.PropTypes;
const block = 'in-chart-with-legend';

const ChartWithLegend = React.createClass({
  mixins: [SubscriptionMixin],

  propTypes: {
    height: rpt.number.isRequired,
    margins: rpt.object,

    timeframe: timeframeShape,

    snapshot: irpt.map.isRequired,
    y1: rpt.object.isRequired,
    y2: rpt.object
  },

  getInitialState() {
    return {
      rollup: 1
    };
  },

  componentDidMount() {
    this.addSubscription(
      currentRollup$.subscribe(rollup => {
        this.setState({ rollup });
      })
    );
  },

  render() {
    return (
      <div className={block}>
          <div className={block + '__rollup-indicator'}>
            {'Rollup ' + this.state.rollup}
          </div>

        <ChartLegend snapshot={this.props.snapshot}
                     y1={this.props.y1}
                     y2={this.props.y2} />

        <Chart snapshot={this.props.snapshot}
               timeframe={this.props.timeframe}
               height={this.props.height}
               y1={this.props.y1}
               y2={this.props.y2}
               margins={this.props.margins} />
      </div>
    );
  }
});

export default ChartWithLegend;
