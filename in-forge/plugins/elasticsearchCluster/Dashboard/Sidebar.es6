import {combineLatest} from 'reactive-observables';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {getClusterMembers} from 'in-stores/clusterMembers';
import HealthInfoBar from 'in-components/HealthInfoBar';
import Collapsible from 'in-components/Collapsible';
import * as timelineStore from 'in-stores/timeline';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
    return {
      timeframe: timelineStore.timeframe,
      clusterMemberStats: getClusterMembers(props.snapshot.get('id'))
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(getSnapshot)))
        .throttle(10000)
        .map(snapshots => {
          const stats = {
            nodes: 0,
            dataNodes: 0,
            masterNodes: 0
          };

          snapshots.forEach(snapshot => {
            stats.nodes++;
            if (snapshot.getIn(['data', 'node.master']) === 'true') {
              stats.masterNodes++;
            }
            if (snapshot.getIn(['data', 'node.type']) === 'data') {
              stats.dataNodes++;
            }
          });

          return stats;
        })
    };
  },
  React.createClass({

    displayName: 'ElasticsearchClusterSidebar',

    mixins: [PureRenderMixin],

    propTypes: {
      timeframe: timelineStore.timeframeShape,
      snapshot: irpt.map.isRequired,
      clusterMemberStats: React.PropTypes.object
    },

    render() {
      const snapshot = this.props.snapshot;
      const snapshotId = snapshot.get('id');
      const data = snapshot.get('data');
      const clusterMemberStats = this.props.clusterMemberStats;

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

          {this.props.clusterMemberStats ?
            <Collapsible>
              <Collapsible.Header>Nodes</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  {this.item('Nodes', clusterMemberStats.nodes)}
                  {this.item('Data Nodes', clusterMemberStats.dataNodes)}
                  {this.item('Master Nodes', clusterMemberStats.masterNodes)}
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          : null}
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
