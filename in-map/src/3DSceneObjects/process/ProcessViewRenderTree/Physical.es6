import irpt from 'react-immutable-proptypes';
import React from 'React';

import {addEdge, removeEdge} from 'in-map/src/stores/process/edgesIdsStore';
import {voteUp, voteDown} from 'in-map/src/stores/process/physicalNodes';


const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Physical',

  propTypes: {
    outgoingConnections: irpt.list.isRequired,
    id: rpt.string.isRequired
  },

  componentDidMount() {
    const props = this.props;

    voteUp(props.id);
    this.addEdges(props.outgoingConnections);
  },

  componentWillUnmount() {
    const props = this.props;

    voteDown(props.id);
    props.outgoingConnections.forEach(connection => removeEdge(connection.get('id')));
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.outgoingConnections !== nextProps.outgoingConnections) {
      this.addEdges(nextProps.outgoingConnections);
    }
  },

  render() {
    return null;
  },

  addEdges(immutableEdges) {
    immutableEdges.forEach(edge => this.addEdge(edge));
  },

  addEdge(immutableEdge) {
    addEdge({
      id: immutableEdge.get('id'),
      from: immutableEdge.get('from'),
      to: immutableEdge.get('to'),
      relation: 'TO'
    });
  }
});
