'use strict';

import Immutable from 'immutable';
import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getLabel} from 'instana-ui-sdk/snapshot';
import * as constants from 'instana-ui-forge/constants';

import Panel from '../../../sdk/Panel';
import ProblemPanel from '../../../sdk/ProblemPanel';
import SidebarHeading from '../../../sdk/SidebarHeading';
import SidebarSubheading from '../../../sdk/SidebarSubheading';
import WiringList from '../../../sdk/WiringList';
import EC2Infos from '../../com.instana.forge.infrastructure.virtualization.EC2/EC2Infos';
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

        <Panel title='System'>
          <HostInfo snapshot={this.props.snapshot} />
        </Panel>

        {ec2 ?
          <Panel title='Amazon'>
            <EC2Infos data={ec2} />
          </Panel>
        : null}

        <ProblemPanel snapshot={this.props.snapshot} />

        <WiringList snapshot={this.props.snapshot}
                    targetPluginId={'com.instana.forge.infrastructure.os.Process'}/>
      </div>
    );
  }

});

export default Sidebar;
