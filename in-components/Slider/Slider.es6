import React from 'react';

import './Slider.less';

const block = 'in-slider';

const Slider = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    defaultValue: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number
  },

  render() {
    return (
      <input type='range'
             className={block}
             min={this.props.min ? this.props.min : 0}
             max={this.props.max ? this.props.max : 100}
             step={0.1}
             defaultValue={this.props.defaultValue ? this.props.defaultValue : 0}
             onChange={this.props.onChange}/>
    );
  }
});

export default Slider;
