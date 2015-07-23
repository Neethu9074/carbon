'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getLabel} from 'instana-ui-sdk/snapshot';

import Panel from 'instana-ui-components/Panel';
import SidebarHeading from 'instana-ui-components/SidebarHeading';
import SidebarSubheading from 'instana-ui-components/SidebarSubheading';
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
        <SidebarHeading>
          Cassandra Details
        </SidebarHeading>
        <SidebarSubheading>
          {getLabel(this.props.snapshot)}
        </SidebarSubheading>

        <Panel title='Cassandra'>
          <CassandraInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default CassandraSidebar;
