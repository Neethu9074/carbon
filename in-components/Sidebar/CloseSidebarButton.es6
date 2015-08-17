import React from 'react/addons';

import Icon from '../Icon';

const rpt = React.PropTypes;
const CloseSidebarButton = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    closeSidebar: rpt.func.isRequired
  },

  render() {
    return (
      <Icon type='arrow-left' onClick={this.props.closeSidebar} />
    );
  }
});

export default CloseSidebarButton;
