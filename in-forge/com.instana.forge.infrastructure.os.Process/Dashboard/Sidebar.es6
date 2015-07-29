'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getLabel} from 'in-sdk/snapshot';

import Panel from 'in-components/Panel';
import SidebarHeading from 'in-components/SidebarHeading';
import SidebarSubheading from 'in-components/SidebarSubheading';
import ProcessInfo from '../ProcessInfo';

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

        <Panel title='Process'>
          <ProcessInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default Sidebar;
