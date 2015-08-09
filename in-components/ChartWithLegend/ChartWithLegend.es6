

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Chart from '../Chart';
import ChartLegend from '../ChartLegendV2';

const rpt = React.PropTypes;

const ChartWithLegend = React.createClass({

  propTypes: {
    height: rpt.number.isRequired,
    margins: rpt.object,

    windowSize: rpt.number.isRequired,
    snapshot: irpt.map.isRequired,
    y1: rpt.object.isRequired,
    y2: rpt.object
  },

  render() {
    return (
      <div>
        <ChartLegend snapshot={this.props.snapshot}
                     y1={this.props.y1}
                     y2={this.props.y2} />

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.windowSize}
               height={this.props.height}
               y1={this.props.y1}
               y2={this.props.y2}
               margins={this.props.margins} />
      </div>
    );
  }
});

export default ChartWithLegend;
