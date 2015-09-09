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
    const className = this.props.className ? this.props.className : '';

    return (
      <div className={className}>
        {this.props.children.map((child, index) => {
          const isSelected = this.props.snapshot &&
            this.props.snapshot.get('id') === child.get('id');
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
