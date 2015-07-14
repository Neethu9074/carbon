'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getLabel} from 'instana-ui-sdk/snapshot';

import Panel from '../../../sdk/Panel';
import SidebarHeading from '../../../sdk/SidebarHeading';
import SidebarSubheading from '../../../sdk/SidebarSubheading';
import JVMInfo from '../JVMInfo';

const rpt = React.PropTypes;
const Sidebar = React.createClass({
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

        <Panel title='Java'>
          <JVMInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default Sidebar;
