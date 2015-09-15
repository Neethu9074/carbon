import React from 'react/addons';

import './ResponsiveTable.less';

const rpt = React.PropTypes;
const block = 'in-responsive-table';

const Button = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: rpt.string,
    isClickable: rpt.bool,
    children: rpt.any.isRequired
  },

  render() {
    let classes = block + '__table';

    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    if(this.props.isClickable){
      classes += ' ' + block + '__table__clickable';
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
