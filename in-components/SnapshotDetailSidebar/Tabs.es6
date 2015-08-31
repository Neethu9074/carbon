import React from 'react/addons';

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

    return (
      <div className={className}>
        {this.props.children.map(child => {
          return (
            <div key={child}
                 className={block + '__tab'}
                 onClick={() => this.props.onItemChanged(child)}>
              {child}
            </div>
          );
        })}
      </div>
    );
  }
});

export default SidebarTabs;
