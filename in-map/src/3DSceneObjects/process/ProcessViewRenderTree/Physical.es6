import irpt from 'react-immutable-proptypes';
import React from 'react';

import {addEdge, removeEdge} from 'in-map/src/stores/process/edgesIdsStore';
import {voteUp, voteDown} from 'in-map/src/stores/process/physicalNodes';


export default React.createClass({

  displayName: 'Physical',

  propTypes: {
    entity: irpt.map.isRequired
  },

  componentDidMount() {
    const entity = this.props.entity;

    voteUp(entity.get('id'));
    entity.get('outgoingConnections').forEach(edge => this.addEdge(edge));
  },

  componentWillUnmount() {
    const entity = this.props.entity;

    voteDown(entity.get('id'));
    entity.get('outgoingConnections').forEach(connection => removeEdge(connection.get('id')));
  },

  componentWillReceiveProps(nextProps) {
    nextProps.entity.get('outgoingConnections').forEach(edge => this.addEdge(edge));
  },

  render() {
    return null;
  },

  addEdge(edgeEntity) {
    addEdge({
      id: edgeEntity.get('id'),
      from: this.props.entity.get('id'),
      to: edgeEntity.get('otherId')
    });
  }
});
