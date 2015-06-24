'use strict';

import Immutable from 'immutable';
import React from 'react/addons';

import {getLabel} from 'instana-ui-sdk/snapshot';
import {formatBytes} from 'instana-ui-services/converters';
import * as constants from 'instana-ui-forge/constants';

import {DescriptionList, DescriptionItem} from '../../sdk/DescriptionList';
import Panel from '../../sdk/Panel';
import ProblemPanel from '../../sdk/ProblemPanel';
import SidebarHeading from '../../sdk/SidebarHeading';
import SidebarSubheading from '../../sdk/SidebarSubheading';
import EC2Infos from '../com.instana.forge.infrastructure.virtualization.EC2/EC2Infos';
import HardwareInfo from './HardwareInfo';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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
          <HardwareInfo snapshot={this.props.snapshot} />
        </Panel>

        {ec2 ?
          <Panel title='Amazon'>
            <EC2Infos data={ec2} />
          </Panel>
        : null}

        <ProblemPanel snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
