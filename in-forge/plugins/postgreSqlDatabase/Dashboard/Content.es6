import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DatabasesTable from 'in-forge/plugins/postgreSqlDatabase/Dashboard/DatabasesTable';
import {timeframeShape} from 'in-stores/timeline';

export default React.createClass({
  displayName: 'PostgreSqlDashboard',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    return (
      <DatabasesTable snapshot={this.props.snapshot}
                      timeframe={this.props.timeframe} />
    );
  }
});
