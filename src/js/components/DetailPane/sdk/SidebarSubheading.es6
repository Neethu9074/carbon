'use strict';

import React from 'react/addons';

const SidebarSubheading = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <h2 className='in-detail-panel__sidebar-subheading'>
        {this.props.children}
      </h2>
    );
  }
});

export default SidebarSubheading;
