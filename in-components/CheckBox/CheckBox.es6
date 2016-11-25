import React from 'react';

import './CheckBox.less';

const block = 'in-checkbox';

const CheckBox = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    defaultChecked: React.PropTypes.bool
  },

  render() {
    return (
      <input type='checkbox'
             className={block}
             defaultChecked={this.props.defaultChecked ? this.props.defaultChecked : false}
             onClick={this.props.onClick} />
    );
  }
});

export default CheckBox;
