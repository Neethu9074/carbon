'use strict';

import React from 'react/addons';
import _ from 'lodash';

import Tooltip from '../Tooltip';
import TooltipFrame from '../index';
import Heading from '../Heading';
import Content from '../Content';
import Icon from 'instana-ui-components/Icon';

import {getColor} from 'instana-ui-sdk/zones';
import {getIps} from 'instana-ui-sdk/snapshot';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    connections: React.PropTypes.array.isRequired
  },

  getIpBySnapshot(snapshot) {
    const ipArray = [];

    snapshot.getIn(['data', 'connections', 'outgoing']).forEach(ip =>
      ipArray.push(ip)
    );

    snapshot.getIn(['data', 'connections', 'incoming']).forEach(ip =>
      ipArray.push(ip)
    );

    return ipArray;
  },

  getOneOfConnectedIps(from, to) {
    if(to.isUnknown) {
      return to.snapshot.get('steadyId');
    }

    //get ips of the target
    const toIps = getIps(to.snapshot);

    //get connected ips
    const fromIps = this.getIpBySnapshot(from.snapshot);

    //intersections
    const matching = _.intersection(fromIps, toIps);

    //one of them
    return matching[0];
  },

  render() {
    const maxCon = 3;
    const connections = this.props.connections;
    const numConnections = connections.length;
    const listItems = connections.slice(0, maxCon).map((connection, index) => {
      const ip = this.getOneOfConnectedIps(connection.from, connection.to);
      const zoneId = connection.to.parent.id;
      const style = {color: getColor(zoneId)};

      return (
        <li key={connection.id} className='in-tooltip__connections-li'>
          <div className='in-tooltip__connections-li--wrapper'>
            <div className='in-tooltip__connections-li--arrow'>
              {connection.direction === 'out' ?
                <Icon type={'arrow_left'} style={{fontSize: '25px'}}/> :
                <Icon type={'arrow_right'} style={{fontSize: '25px'}}/>
              }
            </div>
            <Heading className={'in-tooltip__connections-li--header'}
                     style={style}>
              {zoneId}
            </Heading>
            <Content className='in-tooltip__connections-li--ip'>
              {ip}
            </Content>
          </div>
        </li>
      );
    });

    if(numConnections > maxCon) {
      listItems.push(
        <li key={'unique'} className='in-tooltip__connections__li'>
          <div className='in-tooltip__connections-li--wrapper'>
            <Content>
              {numConnections - maxCon} more
            </Content>
          </div>
        </li>
      );
    }

    return (
      <TooltipFrame>
        <Heading>
          {numConnections + ' connection'.toUpperCase() +
            (numConnections === 1 ? '' : 'S')}
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

    this.hovered = hovered;

    this.render(hovered);
  }

  render(connections) {
    React.render(
      <StickyNoteRC connections={connections}/>,
      this.stickyNoteContainer
    );
  }

  arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length) {
      return false;
    }
    for(let i = arr1.length; i > 0; i--) {
      if(arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  setHovered(hovered) {
    if(this.arraysEqual(hovered, this.hovered)) {
      return;
    }

    this.hovered = hovered;
    this.render(hovered);
  }

  dispose() {
    super.dispose();
  }
}
