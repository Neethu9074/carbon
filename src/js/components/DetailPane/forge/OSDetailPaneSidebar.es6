'use strict';

import Immutable from 'immutable';
import React from 'react/addons';

import {getLabel} from 'instana-ui-sdk/snapshot';
import {formatBytes} from 'instana-ui-services/converters';
import * as constants from 'instana-ui-forge/constants';

import {DescriptionList, DescriptionItem} from '../sdk/DescriptionList';
import Panel from '../sdk/Panel';
import ProblemPanel from '../sdk/ProblemPanel';
import SidebarHeading from '../sdk/SidebarHeading';
import SidebarSubheading from '../sdk/SidebarSubheading';

const ServerDetails = React.createClass({
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
          <DescriptionList>
            <DescriptionItem title='OS'>
              {data.get('os.name')}{' '}
              {data.get('os.arch')}{' '}
              {data.get('os.version')}
            </DescriptionItem>

            <DescriptionItem title='CPU'>
              {data.get('cpu.count')} x {data.get('cpu.model')}
            </DescriptionItem>

            <DescriptionItem title='Memory'>
              {formatBytes(data.get('memory.total'))}
            </DescriptionItem>
          </DescriptionList>
        </Panel>

        {ec2 ?
          <Panel title='Amazon'>
            <DescriptionList horizontal={true}>
              <DescriptionItem title='Instance ID'>
                {ec2.get('instance-id')}
              </DescriptionItem>

              <DescriptionItem title='Type'>
                {ec2.get('instance-type')}
              </DescriptionItem>

              <DescriptionItem title='Availability Zone'>
                {ec2.get('availability-zone')}
              </DescriptionItem>

              <DescriptionItem title='Public Hostname'>
                {ec2.get('public-hostname')}
              </DescriptionItem>

              <DescriptionItem title='Public IP'>
                {ec2.get('public-ipv4')}
              </DescriptionItem>

              <DescriptionItem title='AMI ID'>
                {ec2.get('ami-id')}
              </DescriptionItem>

              <DescriptionItem title='Reservation ID'>
                {ec2.get('reservation-id')}
              </DescriptionItem>

              <DescriptionItem title='Security Group'>
                {ec2.get('security-groups', []).join(', ')}
              </DescriptionItem>

              <DescriptionItem title='VPC'>
                {ec2.get('vpc-ids', []).join(', ')}
              </DescriptionItem>
            </DescriptionList>
          </Panel>
        : null}

        <ProblemPanel snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default ServerDetails;
