import React from 'react/addons';

import {getColor} from 'in-services/util/groupColors';

import TooltipFrame from '../Frame';
import Heading from '../Heading';
import Content from '../Content';
import Icon from '../../Icon';

import './Connection.less';

const block = 'in-tooltip__connection';

const ConnectionTooltip = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    connections: React.PropTypes.array
  },

  render() {
    const connections = this.props.connections;
    if (!connections) {
      return null;
    }

    const maxCon = 3;
    const numConnections = connections.length;
    const listItems = connections.slice(0, maxCon).map(connection => {
      const style = {color: getColor(connection.to.zoneId)};

      return (
        <li key={connection.id} className={block + '__li'}>
          <div className={block + '__li--wrapper'}>
            <div className={block + '__li--arrow'}>
              {connection.direction === 'out' ?
                <Icon type={'arrow_left'} style={{fontSize: '25px'}}/> :
                <Icon type={'arrow_right'} style={{fontSize: '25px'}}/>
              }
            </div>
            <Heading className={block + '__li--header'}
                     style={style}>
              {connection.to.zone}
            </Heading>
            <Content className={block + '__li--ip'}>
              {connection.to.ip || ''}
            </Content>
          </div>
        </li>
      );
    });

    let footer = null;
    if (numConnections > maxCon) {
      footer = (
        <Content className={block + '__footer'}>
          {numConnections - maxCon} more
        </Content>);
    }

    return (
      <TooltipFrame>
        <Heading>
          {numConnections + ' connection' + (numConnections === 1 ? '' : 'S')}
        </Heading>
        <ul className={block + '__ul'}>
          {listItems}
        </ul>
        {footer}
      </TooltipFrame>
    );
  }
});

export default ConnectionTooltip;
