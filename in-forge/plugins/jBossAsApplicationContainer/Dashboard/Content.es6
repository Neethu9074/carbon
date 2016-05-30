import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/DeploymentsTable';
import ConnectorsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ConnectorsTable';
import {timeframeShape} from 'in-stores/timeline';


export default React.createClass({

  displayName: 'JBossAsDashboard',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const snapshot = this.props.snapshot;
    const timeframe = this.props.timeframe;
    return (
      <div>
        <DeploymentsTable snapshot={snapshot}
                          timeframe={timeframe} />

        <ConnectorsTable snapshot={snapshot}
                         timeframe={timeframe} />
      </div>
    );
  }
});
