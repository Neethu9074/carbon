

import React from 'react/addons';

import './Button.less';

const rpt = React.PropTypes;
const block = 'in-button';

const Button = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: rpt.string,
    style: rpt.object,
    children: rpt.any.isRequired,
    type: rpt.oneOf(['button', 'submit']),
    kind: rpt.oneOf(['default']),
    onClick: rpt.func
  },

  render() {
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

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
