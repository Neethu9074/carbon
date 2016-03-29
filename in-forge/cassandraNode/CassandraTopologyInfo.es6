import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import getZone from 'in-hoc/getZone';


export default getZone(React.createClass({

  displayName: 'CassandraTopologyInfo',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    zoneSnapshot: irpt.map
  },

  render() {
    const clusterId = this.props.zoneSnapshot ? this.props.zoneSnapshot.get('id') : undefined;
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem onClick={() => setSelectedSnapshotId(clusterId)}
                         title='Cluster'>
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
}));
