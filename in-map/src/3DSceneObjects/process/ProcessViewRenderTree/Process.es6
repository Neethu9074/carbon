import irpt from 'react-immutable-proptypes';
import React from 'react';

import {addRelation, removeRelation} from 'in-map/src/stores/process/nodeChildrenRelations';
import Physical from 'in-map/src/3DSceneObjects/process/ProcessViewRenderTree/Physical';
import {expandedNodes$} from 'in-map/src/stores/process/expandedNodes';
import {nodes, edges} from 'in-map/src/stores/process/entitiesStores';


export default React.createClass({

  displayName: 'Process',

  propTypes: {
    entity: irpt.map.isRequired
  },

  getInitialState() {
    return {
      isExpanded: false
    };
  },

  componentDidMount() {
    const entity = this.props.entity;
    const id = entity.get('id');
    const children = entity.get('children');

    nodes.voteUp(entity.get('id'), {
      entity,
      type: 'process'
    });
    addRelation(id, children);
    this.addChildrenAsEdges();
    entity.get('outgoingConnections').forEach(edge => this.addEdge(edge));

    this.expandedNodesSubscription = expandedNodes$.subscribe(ids =>
      this.setState({
        isExpanded: ids[id] ? true : false
      })
    );
  },

  componentWillUnmount() {
    this.expandedNodesSubscription.dispose();
    this.expandedNodesSubscription = null;

    const entity = this.props.entity;
    const id = entity.get('id');

    nodes.voteDown(id);
    removeRelation(id);
    entity.get('outgoingConnections').forEach(connection => edges.voteDown(connection.get('id')));
  },

  componentWillReceiveProps(nextProps) {
    const entity = nextProps.entity;
    const children = entity.get('children');

    entity.get('outgoingConnections').forEach(edge => this.addEdge(edge));
    addRelation(entity.get('id'), children);
    this.addChildrenAsEdges();
  },

  render() {
    if (!this.state.isExpanded) {
      return null;
    }

    return (
      <div>
        {this.props.entity.get('children').map(physicalNodeEntity => <Physical key={physicalNodeEntity.get('id')}
                                                                               entity={physicalNodeEntity} />
        )}
      </div>
    );
  },

  addEdge(edgeEntity) {
    edges.voteUp(edgeEntity.get('id'), {
      id: edgeEntity.get('id'),
      from: this.props.entity.get('id'),
      to: edgeEntity.get('otherId')
    });
  },

  addChildrenAsEdges() {
    const from = this.props.entity.get('id');
    this.props.entity.get('children').forEach(child => {
      const to = child.get('id');
      const id = from + ',' + to;

      edges.voteUp(id, {
        id: id + ',' + child.get('id'),
        from,
        to
      });
    });
  }
});
