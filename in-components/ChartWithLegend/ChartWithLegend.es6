import React from 'react';

import createDataSeriesFilterStore from 'in-components/ChartWithLegend/dataseriesFilterStore';
import Chart from 'in-charts/Chart/ChartReactComponent';
import ChartLegend from 'in-components/ChartLegend';
import {timeframeShape} from 'in-stores/timeline';
import {currentRollup$} from 'in-stores/metric';
import connectTo from 'in-hoc/connectTo';

import './ChartWithLegend.less';

const rpt = React.PropTypes;
const block = 'in-chart-with-legend';

export default connectTo({
    currentRollup: currentRollup$
  }, React.createClass({
  displayName: 'ChartWithLegend',

  propTypes: {
    currentRollup: rpt.string.isRequired,

    height: rpt.number,
    margins: rpt.object,

    timeframe: timeframeShape,
    timeframe$: rpt.object,

    snapshotId: rpt.string.isRequired,
    y1: rpt.object.isRequired,
    y2: rpt.object
  },

  getInitialState() {
    return {
      filterStore: createDataSeriesFilterStore()
    };
  },

  render() {
    return (
      <div className={block}>
          <div className={block + '__rollup-indicator'}>
            Rollup {this.props.currentRollup}
          </div>

        <ChartLegend snapshotId={this.props.snapshotId}
                     y1={this.props.y1}
                     y2={this.props.y2}
                     filterStore={this.state.filterStore} />

        <Chart snapshotId={this.props.snapshotId}
               timeframe={this.props.timeframe}
               timeframe$={this.props.timeframe$}
               height={this.props.height || 150}
               y1={this.props.y1}
               y2={this.props.y2}
               margins={this.props.margins}
               activeFilters$={this.state.filterStore.activeFilters$} />
      </div>
    );
  }
}));
