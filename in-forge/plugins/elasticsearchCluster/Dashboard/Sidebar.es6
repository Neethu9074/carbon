import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ClusterMembersList from 'in-components/ClusterMembersList';
import HealthInfoBar from 'in-components/HealthInfoBar';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
    timeframe: timelineStore.timeframe
  },
  React.createClass({

    displayName: 'ElasticsearchClusterSidebar',

    mixins: [PureRenderMixin],

    propTypes: {
      timeframe: timelineStore.timeframeShape,
      snapshot: irpt.map.isRequired
    },

    render() {
      const snapshot = this.props.snapshot;
      const snapshotId = snapshot.get('id');
      const data = snapshot.get('data');

      return (
        <div>
          <DescriptionList>
            {this.item('Health', <HealthInfoBar snapshotId={snapshotId}/>)}
            {this.item('Name', data.get('groupId'))}
            {this.item('Version', 'TODO')}
            {this.item('Status', 'TODO')}
          </DescriptionList>

          <ClusterMembersList snapshotId={snapshotId} />
        </div>
      );
    },

    item(header, content) {
      return (
        <DescriptionItem title={header}>
          {content}
        </DescriptionItem>
      );
    }
  })
);
