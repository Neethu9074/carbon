import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const EC2SidebarDetails = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          <DescriptionItem title='Public Hostname'>
            {data.get('public-hostname')}
          </DescriptionItem>
        </DescriptionList>

        <DescriptionList horizontal={true}>
          <DescriptionItem title='Instance ID'>
            {data.get('instance-id')}
          </DescriptionItem>

          <DescriptionItem title='Type'>
            {data.get('instance-type')}
          </DescriptionItem>

          <DescriptionItem title='Availability Zone'>
            {data.get('availability-zone')}
          </DescriptionItem>

          <DescriptionItem title='Public IP'>
            {data.get('public-ipv4')}
          </DescriptionItem>

          <DescriptionItem title='AMI ID'>
            {data.get('ami-id')}
          </DescriptionItem>

          <DescriptionItem title='Reservation ID'>
            {data.get('reservation-id')}
          </DescriptionItem>

          <DescriptionItem title='Security Group'>
            {data.get('security-groups', []).join(', ')}
          </DescriptionItem>

          <DescriptionItem title='Public Keys'>
            {data.get('public-keys', []).join(', ')}
          </DescriptionItem>

          <DescriptionItem title='VPC'>
            {data.get('vpc-ids', []).join(', ')}
          </DescriptionItem>
        </DescriptionList>
      </div>
    );
  }
});

export default EC2SidebarDetails;
