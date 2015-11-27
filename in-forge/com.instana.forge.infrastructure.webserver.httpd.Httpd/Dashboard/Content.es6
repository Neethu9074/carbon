import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const HttpdDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <DashboardSection title='Requests'>
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   min: 0,
                   metrics: [
                     'requests'
                   ],
                   labels: [
                     'Requests'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
      </div>
    );
  }
});

export default HttpdDashboard;
