import React from 'react/addons';

import './Tab.less';

const block = 'in-snapshot-sidebar-tab';

const SidebarTab = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    item: React.PropTypes.object.isRequired
  },

  render() {
    const item = this.props.item;

    return (
      <div key={item.id}
           className={block}
           onClick={() => this.props.onClick(item)}>
        {item.type}
      </div>
    );
  }
});

export default SidebarTab;
