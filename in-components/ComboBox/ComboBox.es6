import React from 'react';

import './ComboBox.less';

const block = 'in-combobox';

const ComboBox = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
    children: React.PropTypes.array
  },

  render() {
    return (
      <div className={block}>
        {this.props.label}
        <select className={block + '__select'}
                onChange={this.props.onChange}
                defaultValue={this.props.defaultValue ? this.props.defaultValue : false}>
          {this.props.children.map(child =>
            <option value={child}
                    key={child}>
              {child}
            </option>)
          }
        </select>
      </div>
    );
  }
});

export default ComboBox;
