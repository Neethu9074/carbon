import React from 'react/addons';

import './Header.less';

const block = 'in-snapshot-sidebar-header';

const SidebarHeader = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: React.PropTypes.array.isRequired
  },

  render() {

    return (
      <div className={block}>
        {this.props.children}
      </div>
    );
  }
});

export default SidebarHeader;
