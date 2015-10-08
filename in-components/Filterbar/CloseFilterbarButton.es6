import React from 'react/addons';

import Icon from '../Icon';
import './CloseFilterbarButton.less';

const block = 'in-filterbar__close-button';
const rpt = React.PropTypes;
const CloseFilterbarButton = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    closeFilterbar: rpt.func.isRequired
  },

  render() {
    return (
      <div className={block}>

        <div className={block + '__wrapper'}
             onClick={this.props.closeFilterbar}>
          <Icon type='arrow_right'
                className={block + '__icon'}/>
          Close
        </div>
      </div>
    );
  }
});

export default CloseFilterbarButton;
