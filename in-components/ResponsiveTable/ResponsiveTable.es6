import React from 'react/addons';

import './ResponsiveTable.less';

const rpt = React.PropTypes;
const block = 'in-responsive-table-wrapper';

const Button = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: rpt.string,
    style: rpt.object,
    children: rpt.any.isRequired
  },

  render() {
    return (
      <div className={block}>
        <table className='in-responsive-table in-responsive-table--clickable'>
          {this.props.children}
        </table>
      </div>
    );
  }
});

export default Button;
