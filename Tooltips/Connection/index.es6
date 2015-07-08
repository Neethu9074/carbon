'use strict';

import React from 'react/addons';

import TooltipFrame from '../Frame';
import Heading from '../Heading';
import Content from '../Content';
import Icon from '../../Icon';

import {getColor} from 'instana-ui-sdk/zones';

import './index.less';


/*eslint-disable no-unused-vars*/
export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    connections: React.PropTypes.array.isRequired
  },

  render() {
    const maxCon = 3;
    const connections = this.props.connections;
    const numConnections = connections.length;
    const listItems = connections.slice(0, maxCon).map((connection, index) => {
      const ip = connection.to.ip;
      const zoneId = connection.to.zone;
      const style = {color: getColor(zoneId)};

      return (
        <li key={connection.id} className='in-tooltip__connection-li'>
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

    let footer = null;
    if(numConnections > maxCon) {
      footer = (
        <Content className='in-tooltip__connections-footer'>
          {numConnections - maxCon} more
        </Content>);
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
        {footer}
      </TooltipFrame>
    );
  }
});
/*eslint-enable no-unused-vars*/
