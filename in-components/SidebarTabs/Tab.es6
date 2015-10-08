import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getSingular} from 'in-sdk/pluginName';
import {getIcon} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip';

import './Tab.less';

const block = 'in-sidebar-tab';
const rpt = React.PropTypes;

const SidebarTab = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    isSelected: rpt.bool.isRequired,
    children: irpt.map.isRequired,
    onClick: rpt.func.isRequired,
    className: rpt.string
  },

  render() {
    let className = this.props.isSelected ? block + ' ' + block + '__selected' : block;
    className += ' ' + this.props.className;
    const item = this.props.children;

    return (
      <Tooltip content={getSingular(item.get('pluginId'))}>
        <li className={className}
            onClick={() => this.props.onClick(item)}>

          <img src={getIcon(item)}
               alt='Snapshot icon'
               className={block + '__icon'}/>

        </li>
      </Tooltip>
    );
  }
});

export default SidebarTab;
