import React from 'react/addons';

import './ResponsiveTable.less';

const rpt = React.PropTypes;
const block = 'in-responsive-table';

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
        <table className={block + '__table ' + block + '__clickable'}>
          {this.props.children}
        </table>
      </div>
    );
  }
});

export default Button;
