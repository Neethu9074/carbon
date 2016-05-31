import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

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
