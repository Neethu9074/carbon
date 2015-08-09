

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'in-services/converters';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 300;

const DockerDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <DashboardSection title='Memory'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'memory.active_anon',
                               'memory.active_file',
                               'memory.inactive_anon',
                               'memory.inactive_file'
                             ],
                             labels: [
                               'active_anon',
                               'active_file',
                               'inactive_anon',
                               'inactive_file'
                             ],
                             formatter: formatBytes,
                             type: 'line'
                           }}/>
        </DashboardSection>
      </div>
    );
  }

});

export default DockerDashboard;
