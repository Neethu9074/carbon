import React from 'react';

import './CheckBox.less';

const block = 'in-checkbox';

const CheckBox = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    defaultChecked: React.PropTypes.bool
  },

  render() {
    return (
      <div className={block}>
        <input type='checkbox'
               className={block + '__checkbox'}
               defaultChecked={this.props.defaultChecked ? this.props.defaultChecked : false}
               onClick={this.props.onClick}/>
        {this.props.label}
      </div>
    );
  }
});

export default CheckBox;
