'use strict';

import Immutable from 'immutable';
import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getLabel} from 'in-sdk/snapshot';
import * as constants from 'in-forge/constants';
import Collapsible from 'in-components/Collapsible';

import TagList from 'in-components/TagList/TagList';
import ProblemPanel from 'in-components/ProblemPanel';
import SidebarHeading from 'in-components/SidebarHeading';
import SidebarSubheading from 'in-components/SidebarSubheading';
import WiringList from 'in-components/WiringList';
import EC2Info from '../../com.instana.forge.infrastructure.virtualization.EC2/EC2Info';
import HostInfo from '../HostInfo';

const rpt = React.PropTypes;
const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const ec2s = data.getIn([constants.rels.describes, constants.plugins.ec2],
                            Immutable.Map());
    const ec2 = ec2s.valueSeq().first();

    return (
      <div>
        <SidebarHeading>
          Server Details
        </SidebarHeading>
        <SidebarSubheading>
          {getLabel(this.props.snapshot)}
        </SidebarSubheading>

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>System</Collapsible.Header>
          <Collapsible.Content>
            <HostInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        {ec2 ?
          <Collapsible initiallyOpen={true}>
            <Collapsible.Header>Amazon</Collapsible.Header>
            <Collapsible.Content>
              <EC2Info data={ec2} />
            </Collapsible.Content>
          </Collapsible>
        : null}

        <ProblemPanel snapshot={this.props.snapshot} />
        <TagList snapshot={this.props.snapshot} />
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
