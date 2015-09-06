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

  getInitialState() {
    return { selectedCoords: undefined };
  },

  render() {
    const className = this.props.className ?
                      block + ' ' + this.props.className :
                      block;

    return (
      <div className={className}>
        {this.props.children.map((child, index) => {
          const isSelected = (this.state.selectedCoords && this.state.selectedCoords === child) ?
            true : false;
          return (
            <Tab key={index}
                 onClick={this.onClick}
                 isSelected={isSelected}
                 item={child}/>
          );
        })}
      </div>
    );
  },

  onClick(e) {
    this.setState({selectedCoords: e});
    this.props.onItemChanged(e);
  }
});

export default SidebarTabs;
