import React from 'react/addons';

import './ResponsiveTable.less';

const rpt = React.PropTypes;
const block = 'in-responsive-table';

const Button = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: rpt.string,
    clickable: rpt.bool,
    children: rpt.any.isRequired
  },

  render() {
    let classes = block;

    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    if (this.props.clickable) {
      classes += ' ' + block + '__clickable';
    }
    return (
      <table className={block}>
        {this.props.children}
      </table>
    );
  }
});

export default Button;
