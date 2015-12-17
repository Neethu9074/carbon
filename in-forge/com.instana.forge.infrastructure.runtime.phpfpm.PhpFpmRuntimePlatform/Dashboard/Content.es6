import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const chartHeight = 150;
const rpt = React.PropTypes;

const PhpFpmDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
        <DashboardSection title='Connections'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 90,
                             right: 60
                           }}

                           y1={{
                             min: 0,
                             formatter: numberFormatters.zeroDecimalPlaces,
                             tooltipFormatter: numberFormatters.zeroDecimalPlaces,
                             metrics: [
                               'accepted conn',
                               'slow requests'
                             ],
                             labels: [
                               'Accepted Connections',
                               'Slow Requests'
                             ],
                             type: 'line'
                           }}

                           y2={{
                             min: 0,
                             formatter: numberFormatters.zeroDecimalPlaces,
                             metrics: [
                               'listen queue',
                               'max listen queue',
                               'listen queue len'
                             ],
                             labels: [
                               'Listen Queue',
                               'Max',
                               'Length'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
        <DashboardSection title='Processes'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 90,
                             right: 60
                           }}

                           y1={{
                             min: 0,
                             formatter: numberFormatters.zeroDecimalPlaces,
                             tooltipFormatter: numberFormatters.zeroDecimalPlaces,
                             metrics: [
                               'idle processes',
                               'active processes',
                               'total processes'
                             ],
                             labels: [
                               'Idle',
                               'Active',
                               'Total'
                             ],
                             type: 'line'
                           }}

                           y2={{
                             min: 0,
                             formatter: numberFormatters.zeroDecimalPlaces,
                             metrics: [
                               'max active processes',
                               'max children reached'
                             ],
                             labels: [
                               'Max Active',
                               'Max Children'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
    </div>
    );
  }
});

export default PhpFpmDashboard;
