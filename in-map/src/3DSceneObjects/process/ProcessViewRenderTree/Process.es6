import irpt from 'react-immutable-proptypes';
import React from 'React';

import {addRelation, removeRelation} from 'in-map/src/stores/process/nodeChildrenRelations';
import Physical from 'in-map/src/3DSceneObjects/process/ProcessViewRenderTree/Physical';
import {addEdge, removeEdge} from 'in-map/src/stores/process/edgesIdsStore';
import {voteUp, voteDown} from 'in-map/src/stores/process/processNodes';
import {expandedNodes$} from 'in-map/src/stores/process/expandedNodes';


const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Process',

  propTypes: {
    outgoingConnections: irpt.list.isRequired,
    id: rpt.string.isRequired,
    children: irpt.list
  },

  getInitialState() {
    return {
      isExpanded: false
    };
  },

  componentDidMount() {
    const props = this.props;

    voteUp(props.id);
    addRelation(props.id, props.children);
    this.addEdges(props.outgoingConnections);
    this.addChildrenAsEdges(props.children);

    this.expandedNodesSubscription = expandedNodes$.subscribe(ids =>
      this.setState({
        isExpanded: ids[props.id]
      })
    );
  },

  componentWillUnmount() {
    this.expandedNodesSubscription.dispose();
    this.expandedNodesSubscription = null;

    const props = this.props;

    voteDown(props.id);
    removeRelation(props.id);
    props.outgoingConnections.forEach(connection => removeEdge(connection.get('id')));
  },

  componentWillReceiveProps(nextProps) {
    const props = this.props;

    if (props.outgoingConnections !== nextProps.outgoingConnections) {
      this.addEdges(nextProps.outgoingConnections);
    }
    if (props.children !== nextProps.children) {
      addRelation(props.id, props.children);
      this.addChildrenAsEdges(nextProps.children);
    }
  },

  render() {
    if (!this.state.isExpanded) {
      return null;
    }

    return (
      <div>
        {this.props.children.map(physicalNodeEntity =>
          <Physical key={physicalNodeEntity.get('id')}
                    outgoingConnections={physicalNodeEntity.get('outgoingConnections')}
                    id={physicalNodeEntity.get('id')} />
        )}
      </div>
    );
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
  },

  addChildrenAsEdges(children) {
    children.forEach(child => addEdge({
      id: this.props.id + ',' + child.get('id'),
      from: this.props.id,
      to: child.get('id'),
      relation: 'OF'
    }));
  }
});
