import React from 'react/addons';

import Tab from './Tab';

import './Tabs.less';

const block = 'in-snapshot-sidebar-tabs';

const SidebarTabs = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onItemChanged: React.PropTypes.func.isRequired,
    children: React.PropTypes.array.isRequired,
    className: React.PropTypes.string
  },

  render() {
    const className = this.props.className ?
                      block + ' ' + this.props.className :
                      block;

    let key = 0;
    return (
      <div className={className}>
        {this.props.children.map(child => {
          return (
            <Tab key={key++}
                 onClick={this.props.onItemChanged}
                 item={child}/>
          );
        })}
      </div>
    );
  }
});

export default SidebarTabs;
