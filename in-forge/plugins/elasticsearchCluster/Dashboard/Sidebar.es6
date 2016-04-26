import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import HealthInfoBar from 'in-components/HealthInfoBar';
import Collapsible from 'in-components/Collapsible';
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
          <Collapsible initiallyOpen={true}>
            <Collapsible.Header>Elasticsearch Cluster</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                {this.item('Health', <HealthInfoBar snapshotId={snapshotId}/>)}
                {this.item('Name', data.get('groupId'))}
                {this.item('Version', 'TODO')}
                {this.item('Status', 'TODO')}
              </DescriptionList>
            </Collapsible.Content>
          </Collapsible>

          <Collapsible>
            <Collapsible.Header>Nodes</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                {this.item('Nodes', data.get('node_count'))}
                {this.item('Data Nodes', data.get('data_node_count'))}
                {this.item('Master Nodes', data.get('master_node_count'))}
              </DescriptionList>
            </Collapsible.Content>
          </Collapsible>
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
