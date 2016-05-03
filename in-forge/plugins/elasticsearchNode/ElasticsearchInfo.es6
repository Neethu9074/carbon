import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import getZone from 'in-hoc/getZone';

export default getZone(React.createClass({
  displayName: 'ElasticsearchInfo',

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
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>

        <DescriptionItem onClick={() => setSelectedSnapshotId(clusterId)}
                         title='Cluster'>
          {data.get('cluster.name')}
        </DescriptionItem>

        <DescriptionItem title='Node'>
          {data.get('node.name')}
        </DescriptionItem>

        <DescriptionItem title='Node Type'>
          {data.get('node.type')}
        </DescriptionItem>

        <DescriptionItem title='Master'>
          {data.get('node.master')}
        </DescriptionItem>

        <DescriptionItem title='Master Eligible'>
          {data.get('node.master_eligible')}
        </DescriptionItem>

        <DescriptionItem title='Transport'>
          {data.get('transport')}
        </DescriptionItem>

        <DescriptionItem title='Log Directory'>
          {data.get('log.dir')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
}));
