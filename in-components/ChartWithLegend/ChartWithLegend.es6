import React from 'react';

import createDataSeriesFilterStore from 'in-components/ChartWithLegend/dataseriesFilterStore';
import Chart from 'in-charts/Chart/ChartReactComponent';
import ChartLegend from 'in-components/ChartLegend';
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
    const props = this.props;

    return (
      <div className={block}>
          <div className={block + '__rollup-indicator'}>
            Rollup {props.currentRollup}
          </div>

        <ChartLegend snapshotId={props.snapshotId}
                     y1={props.y1}
                     y2={props.y2}
                     filterStore={this.state.filterStore} />

        <Chart snapshotId={props.snapshotId}
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
