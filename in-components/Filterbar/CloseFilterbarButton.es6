import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Icon from '../Icon';
import './CloseFilterbarButton.less';

const block = 'in-filterbar__close-button';
const rpt = React.PropTypes;
const CloseFilterbarButton = React.createClass({
  mixins: [PureRenderMixin],

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
