import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './ResponsiveTable.less';

const rpt = React.PropTypes;
const block = 'in-responsive-table';

const Button = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    children: rpt.any.isRequired,
    clickable: rpt.bool
  },

  render() {
    let classes = block;
    if (this.props.clickable) {
      classes += ' ' + block + '__clickable';
    }

    return (
      <table className={classes}>
        {this.props.children}
      </table>
    );
  }
});

export default Button;
