import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import * as timelineStore from 'in-stores/timeline';
import getZone from 'in-hoc/getZone';
import connectTo from 'in-hoc/connectTo';

import SparkChartsSection from './Sidebar/SparkChartsSection';

export default getZone(connectTo({
    timeframe: timelineStore.timeframe
  },
  React.createClass({

  displayName: 'ElasticsearchInfo',

  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: timelineStore.timeframeShape,
    snapshot: irpt.map.isRequired,
    zoneSnapshot: irpt.map
  },

  render() {
    const snapshotId = this.props.snapshot.get('id');
    const clusterId = this.props.zoneSnapshot ? this.props.zoneSnapshot.get('id') : undefined;
    const data = this.props.snapshot.get('data');

    return (
      <div>
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
      <SparkChartsSection snapshotId={snapshotId}
                          timeframe={this.props.timeframe}/>
      </div>
    );
  }
})));
