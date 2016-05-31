import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import HttpServersTable from 'in-forge/plugins/genericNodejsApp/Dashboard/HttpServersTable';
import {timeframeShape} from 'in-stores/timeline';

const NodejsDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    return (
      <div>
        <HttpServersTable snapshot={this.props.snapshot}
                          timeframe={this.props.timeframe} />
      </div>
    );
  }
});

export default NodejsDashboard;
