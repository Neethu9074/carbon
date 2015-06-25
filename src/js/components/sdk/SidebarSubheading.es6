'use strict';

import React from 'react/addons';

import './SidebarSubheading.less';

const SidebarSubheading = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <h2 className='in-sidebar__sub-heading'>
        {this.props.children}
      </h2>
    );
  }
});

export default SidebarSubheading;
