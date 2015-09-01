import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getIcon} from 'in-sdk/snapshot';

import './Tab.less';

const block = 'in-snapshot-sidebar-tab';

const SidebarTab = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    isSelected: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired,
    item: irpt.map.isRequired
  },

  render() {
    const item = this.props.item;
    const id = item.get('id');
    const className = this.props.isSelected ?
      block + ' ' + block + '__selected' :
      block;

    return (
      <div key={id}
           className={className}
           onClick={() => this.props.onClick(item)}>

        <img src={getIcon(item)}
             alt='Snapshot icon'
             className={block + '__icon'}/>
      </div>
    );
  }
});

export default SidebarTab;
