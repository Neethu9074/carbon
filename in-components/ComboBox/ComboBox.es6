import React from 'react';

import './ComboBox.less';

const block = 'in-combobox';

const ComboBox = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    defaultValue: React.PropTypes.string,
    children: React.PropTypes.array
  },

  render() {
    return (
      <select className={block}
              onChange={this.props.onChange}
              defaultValue={this.props.defaultValue ? this.props.defaultValue : false}>
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
