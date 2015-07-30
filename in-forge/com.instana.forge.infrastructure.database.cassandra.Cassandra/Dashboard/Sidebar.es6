'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Panel from 'in-components/Panel';
import CassandraInfo from '../CassandraInfo';

const rpt = React.PropTypes;
const CassandraSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Panel title='Cassandra'>
          <CassandraInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default CassandraSidebar;
