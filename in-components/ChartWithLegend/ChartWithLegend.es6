import React from 'react';

import createDataSeriesFilterStore from 'in-components/ChartWithLegend/dataseriesFilterStore';
import {currentRollup$, getRollupForTimeframe} from 'in-stores/metric';
import Chart from 'in-charts/Chart/ChartReactComponent';
import ChartLegend from 'in-components/ChartLegend';
import connectTo from 'in-hoc/connectTo';

import './ChartWithLegend.less';


const block = 'in-chart-with-legend';

export default connectTo(props => {
  return {
    currentRollup: props.timeframe$
      ? props.timeframe$.map(getRollupForTimeframe)
      : currentRollup$
  };
}, React.createClass({
  displayName: 'ChartWithLegend',

  getInitialState() {
    return {
      filterStore: createDataSeriesFilterStore()
    };
  },

  render() {
    const props = this.props;
    if (!props.currentRollup) {
      return null;
    }

    return (
      <div className={block}>
        <div className={block + '__rollup-indicator'}>
          Rollup {props.currentRollup}
        </div>

        <ChartLegend snapshotId={props.snapshotId}
                     snapshotIds={props.snapshotIds}
                     y1={props.y1}
                     y2={props.y2}
                     filterStore={this.state.filterStore}
                     timeframe$={props.timeframe$} />

        <Chart snapshotId={props.snapshotId}
               snapshotIds={props.snapshotIds}
               timeframe$={props.timeframe$}
               height={props.height || 150}
               y1={props.y1}
               y2={props.y2}
               margins={props.margins}
               activeFilters$={this.state.filterStore.activeFilters$} />
      </div>
    );
  }
}));
