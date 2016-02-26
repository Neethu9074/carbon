import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Icon from '../Icon';

import './CloseButton.less';

const rpt = React.PropTypes;
const block = 'in-popupable-close-button';

const CloseButton = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    onClick: rpt.func.isRequired,
    className: rpt.any
  },

  render() {
    const className = this.props.className ? this.props.className + ' ' + block : block;

    return (
      <div className={className}
           onClick={this.props.onClick}>
        <Icon type='delete' className={block + '__icon'}/>
      </div>
    );
  }
});

export default CloseButton;
