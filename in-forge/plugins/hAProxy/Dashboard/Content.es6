import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import FrontendsTable from 'in-forge/plugins/hAProxy/Dashboard/FrontendsTable';
import BackendsTable from 'in-forge/plugins/hAProxy/Dashboard/BackendsTable';
import {timeframeShape} from 'in-stores/timeline';

const HAProxyDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const snapshot = this.props.snapshot;
    const socketPath = snapshot.getIn(['data', 'socketPath']);
    if (!socketPath) {
      return (
        <DashboardNotification type='info'>
          HAProxy is not configured for socket access.
          Please configure 'stats socket' to point to a UNIX socket.
        </DashboardNotification>
      );
    }
    return (
      <div>
        <FrontendsTable snapshot={this.props.snapshot}
                        timeframe={this.props.timeframe} />
        <BackendsTable snapshot={this.props.snapshot}
                       timeframe={this.props.timeframe} />
      </div>
    );
  }
});

export default HAProxyDashboard;
