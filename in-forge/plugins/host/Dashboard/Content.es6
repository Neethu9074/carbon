import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Chart from 'in-charts/Chart/ChartReactComponent';
import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import NetworkInterfacesTable from 'in-forge/plugins/host/Dashboard/NetworkInterfacesTable';
import FilesystemsTable from 'in-forge/plugins/host/Dashboard/FilesystemsTable';
import CpuTable from 'in-forge/plugins/host/Dashboard/CpuTable';
import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import {getRawPayload} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';


const chartHeight = 200;

export default connectTo(
  props => {
    return {
      processes: getRawPayload(props.snapshot.get('id'), 'processes')
    };
  },
  React.createClass({

    displayName: 'HostDashboard',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      snapshot: irpt.map.isRequired,
      timeframe: timeframeShape,
      processes: irpt.list
    },

    render() {
      const timeframe = this.props.timeframe;
      const snapshot = this.props.snapshot;

      return (
        <div>
          <DashboardSection title='CPU Usage'>
            <Chart snapshotId={snapshot.get('id')}
                   height={chartHeight}
                   margins={{
                     left: 60
                   }}
                   y1={{
                     min: 0,
                     max: 1,
                     formatter: percentageZeroDecimalPlaces,
                     metrics: [
                       'cpu.user',
                       'cpu.sys',
                       'cpu.wait',
                       'cpu.nice',
                       'cpu.steal'
                     ],
                     labels: [
                       'User',
                       'System',
                       'Wait',
                       'Nice',
                       'Steal'
                     ],
                     type: 'stackedArea'
                   }}/>
          </DashboardSection>
        </div>
      );
    },

    selectCpu(cpu) {
      this.setState({
        cpuNo: cpu
      });
    },

    selectInterface(iface) {
      this.setState({
        interfaceName: iface
      });
    },

    isWindows() {
      return !!this.props.snapshot.getIn(['data', 'os.name'], '').match(/windows/i);
    }
  })
);
