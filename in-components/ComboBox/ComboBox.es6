import React from 'react';

import './ComboBox.less';

const block = 'in-combobox';

const ComboBox = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    children: React.PropTypes.array
  },

  render() {
    return (
      <select className={block}
              onChange={this.props.onChange}
              value={this.props.value ? this.props.value : false}>
        {this.props.children.map(child =>
          <option value={child}
                  key={child}>
            {child}
          </option>)
        }
      </select>
    );
  }
});

export default ComboBox;
