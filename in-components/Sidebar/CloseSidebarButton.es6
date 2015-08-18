import React from 'react/addons';

import Icon from '../Icon';
import './CloseSidebarButton.less';

const block = 'in-sidebar__close-button';
const rpt = React.PropTypes;
const CloseSidebarButton = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    closeSidebar: rpt.func.isRequired
  },

  render() {
    return (
      <Icon type='arrow_right'
            onClick={this.props.closeSidebar}
            className={block}/>
    );
  }
});

export default CloseSidebarButton;
