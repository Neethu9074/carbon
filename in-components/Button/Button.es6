import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClassName} from 'in-services/react';

import './Button.less';

const rpt = React.PropTypes;
const block = 'in-button';

const Button = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    className: rpt.string,
    style: rpt.object,
    children: rpt.any.isRequired,
    type: rpt.oneOf(['button', 'submit']),
    kind: rpt.oneOf(['default']),
    onClick: rpt.func
  },

  render() {
    let classes = getClassName(this, block);

    const kind = this.props.kind || 'default';
    classes += ' ' + block + '--' + kind;

    return (
      <button className={classes}
              type={this.props.type || 'button'}
              onClick={this.props.onClick}
              style={this.props.style}>
        {this.props.children}
      </button>
    );
  }
});

export default Button;
