import irpt from 'react-immutable-proptypes';
import React from 'react';

import {nodes, edges} from 'in-map/src/stores/process/entitiesStores';


export default React.createClass({

  displayName: 'Physical',

  propTypes: {
    entity: irpt.map.isRequired
  },

  componentDidMount() {
    const entity = this.props.entity;
    nodes.voteUp(entity.get('id'), {
      entity,
      type: 'physical'
    });
    entity.get('outgoingConnections').forEach(edge => this.addEdge(edge));
  },

  componentWillUnmount() {
    const entity = this.props.entity;

    nodes.voteDown(entity.get('id'));
    entity.get('outgoingConnections').forEach(connection => edges.voteDown(connection.get('id')));
  },

  componentWillReceiveProps(nextProps) {
    nextProps.entity.get('outgoingConnections').forEach(edge => this.addEdge(edge));
  },

  render() {
    return null;
  },

  addEdge(edgeEntity) {
    edges.voteUp(edgeEntity.get('id'), {
      id: edgeEntity.get('id'),
      from: this.props.entity.get('id'),
      to: edgeEntity.get('otherId')
    });
  }
});
