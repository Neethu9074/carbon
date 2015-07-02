'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';

import TooltipFrame from '../index';
import Heading from '../Heading';
import Content from '../Content';

import {getIps} from 'instana-ui-sdk/snapshot';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    connections: React.PropTypes.array.isRequired
  },

  getIpsFromNode(node) {
    if(node.isUnknown) {
      return [node.snapshot.get('steadyId')];
    }
    return getIps(node.snapshot);
  },

  render() {
    const connections = this.props.connections;
    const listItems = connections.map((connection, index) => {
      const ips = this.getIpsFromNode(connection.to);
      if(ips.length === 0) {
        return null;
      }

      return (
        <li key={connection.id} className='in-tooltip__connections__li'>
          <div className='in-tooltip__connections-li--wrapper'>
            <div className='in-tooltip__connections-li--arrow'>
              {connection.direction === 'out' ? '<-' : '->'}
            </div>
            <Heading className={'in-tooltip__connections-li--header'}>
              {connection.to.parent.id}
            </Heading>
            <Content className='in-tooltip__connections-li--ip'>
              {ips[0]}
            </Content>
          </div>
        </li>
      );
    });

    return (
      <TooltipFrame>
        <Heading>
          {'x connections'.toUpperCase()}
        </Heading>
        <ul className='in-tooltip__connections-ul'>
          {listItems}
        </ul>
      </TooltipFrame>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class TooltipConnection extends Tooltip {
  constructor(parent, hovered) {
    super(parent);
    this.render(hovered);
  }

  render(connections) {
    React.render(
      <StickyNoteRC connections={connections}/>,
      this.stickyNoteContainer
    );
  }

  setHovered(hovered) {
    this.render(hovered);
  }

  dispose() {
    super.dispose();
  }
}
