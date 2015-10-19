

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const CassandraTopologyInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Cluster'>
          {data.get('clusterName')}
        </DescriptionItem>


        <DescriptionItem title='Datacenter'>
          {data.get('datacenter')}
        </DescriptionItem>

        <DescriptionItem title='Rack'>
          {data.get('rack')}
        </DescriptionItem>

        <DescriptionItem title='Host-Id'>
          {data.get('hostId')}
        </DescriptionItem>

      </DescriptionList>
    );
  }
});

export default CassandraTopologyInfo;
