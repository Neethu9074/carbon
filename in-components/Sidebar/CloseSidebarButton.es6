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
      <div className={block}
           onClick={this.props.closeSidebar}>

        <Icon type='arrow_right'
              className={block + '__icon'}/>

        Close

      </div>
    );
  }
});

export default CloseSidebarButton;
