'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'instana-ui-components/DescriptionList';

const EC2Infos = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    data: irpt.map.isRequired
  },

  render() {
    const data = this.props.data;

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

export default EC2Infos;
