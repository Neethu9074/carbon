import React from 'react/addons';

import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';

import ConnectionItem from './ConnectionItem';
import Tooltip from '../../Tooltip.es6';


const ConnectionsTooltipRC = React.createClass({

  displayName: 'connection tooltip',

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    connections: React.PropTypes.array.isRequired
  },

  render() {
    const connections = this.props.connections;
    return (
      <TooltipFrame>
        <Heading>
          {connections.length + ' connection' + (connections.length === 1 ? '' : 's')}
        </Heading>
        {connections.map((connection, index) =>
          <ConnectionItem key={index}
                          snapshotId={connection.destinationNode.id}
                          direction={connection.direction}
                          sourceSnapshot={connection.sourceNode.snapshot}/>
        )}
      </TooltipFrame>
    );
  }
});


export default class TooltipConnection extends Tooltip {
  constructor(parent, hovered) {
    super(parent);

    this.hovered = hovered;
  }

  render() {
    React.render(
      <ConnectionsTooltipRC connections={this.hovered}/>,
      this.stickyNoteContainer
    );
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  setHovered(hovered) {
    if (this.arraysEqual(hovered, this.hovered)) {
      return;
    }

    this.hovered = hovered;
    this.render();
  }

  dispose() {
    this.unMount();
  }
}
