import React from 'react/addons';

import {getClassName} from 'in-services/react';

import './ResponsiveTable.less';

const rpt = React.PropTypes;
const block = 'in-responsive-table';

const Button = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: rpt.any.isRequired,
    className: rpt.string,
    clickable: rpt.bool
  },

  render() {
    let classes = getClassName(this, block + '__table');
    if (this.props.clickable) {
      classes += ' ' + block + '__table--clickable';
    }
    return (
      <div className={block}>
        <table className={classes}>
          {this.props.children}
        </table>
      </div>
    );
  }
});

export default Button;
