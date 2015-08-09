

import React from 'react/addons';

import './SidebarHeading.less';

const SidebarHeading = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: React.PropTypes.any.isRequired
  },

  render() {
    return (
      <h1 className='in-sidebar__heading'>
        {this.props.children}
      </h1>
    );
  }
});

export default SidebarHeading;
