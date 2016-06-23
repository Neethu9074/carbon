import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ClusterMembersList from 'in-components/ClusterMembersList';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';


export default React.createClass({

  displayName: 'CassandraClusterSidebar',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const snapshotId = snapshot.get('id');
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          {this.item('Health', <AnnotatedHealthBar snapshotId={snapshotId}/>)}
          {this.item('Name', data.get('groupId'))}
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
});
