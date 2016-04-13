import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ClusterMembersList from 'in-components/ClusterMembersList';


export default React.createClass({

  displayName: 'ElasticsearchClusterSidebar',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          <DescriptionItem title='Cluster name'>
            {data.get('cluster.name')}
          </DescriptionItem>
        </DescriptionList>

        <ClusterMembersList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});
