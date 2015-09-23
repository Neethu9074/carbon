import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Tab from './Tab';

const SidebarTabs = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onItemChanged: React.PropTypes.func.isRequired,
    children: React.PropTypes.array.isRequired,
    className: React.PropTypes.string,
    snapshot: irpt.map
  },

  render() {
    const children = this.props.children;
    if (!children || children.length === 0) {
      return null;
    }

    const snapshot = this.props.snapshot;

    return (
      <div className={this.props.className}>
        {children.map((child, index) => {
          const isSelected = snapshot && snapshot.get('id') === child.get('id');
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
    this.props.onItemChanged(e);
  }
});

export default SidebarTabs;
