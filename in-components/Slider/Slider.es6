import React from 'react';

import './Slider.less';

const block = 'in-slider';

const Slider = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    defaultValue: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number
  },

  render() {
    return (
      <div className={block}>
        <input type='range'
               className={block + '__range'}
               min={this.props.min ? this.props.min : 0}
               max={this.props.max ? this.props.max : 100}
               step={0.1}
               defaultValue={this.props.defaultValue ? this.props.defaultValue : 0}
               onChange={this.props.onChange}/>
        {this.props.label}
      </div>
    );
  }
});

export default Slider;
