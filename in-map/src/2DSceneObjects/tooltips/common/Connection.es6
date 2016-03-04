import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import React from 'react';

import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';

import Tooltip from '../Tooltip.es6';


const ConnectionsTooltip = React.createClass({

  displayName: 'connection tooltip',

  mixins: [PureRenderMixin],

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
        {connections.map(connection => connection.getTooltipLine())}
      </TooltipFrame>
    );
  }
});


export default class ConnectionTooltip extends Tooltip {
  constructor(parent, hovered) {
    super({parent});

    this.hovered = hovered;
  }

  render() {
    ReactDOM.render(
      <ConnectionsTooltip connections={this.hovered}/>,
      this.container
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
}
