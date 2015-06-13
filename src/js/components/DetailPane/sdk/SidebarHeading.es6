'use strict';

import React from 'react/addons';

const SidebarHeading = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <h1 className='in-detail-pane__sidebar-heading'>
        {this.props.children}
      </h1>
    );
  }
});

export default SidebarHeading;
