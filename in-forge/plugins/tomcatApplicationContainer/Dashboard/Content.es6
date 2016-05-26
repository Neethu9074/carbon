import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ConnectorsTable';
import WebAppsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/WebAppsTable';
import {timeframeShape} from 'in-stores/timeline';

const TomcatDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const props = this.props;
    const snapshot = props.snapshot;
    const timeframe = props.timeframe;

    return (
      <div>
        <WebAppsTable snapshot={snapshot}
                      timeframe={timeframe} />

        <ConnectorsTable snapshot={snapshot}
                         timeframe={timeframe} />
      </div>
    );
  }
});

export default TomcatDashboard;
