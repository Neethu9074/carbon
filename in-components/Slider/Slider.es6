import React from 'react';

import {getClassName} from 'in-services/react';

import './Slider.less';


const block = 'in-slider';
const rpt = React.PropTypes;

const Slider = React.createClass({
  propTypes: {
    onChange: rpt.func.isRequired,
    defaultValue: rpt.any,
    className: rpt.string,
    step: rpt.number,
    min: rpt.number,
    max: rpt.number
  },

  render() {
    return (
      <input type='range'
             className={getClassName(this, block)}
             min={this.props.min ? this.props.min : 0}
             max={this.props.max ? this.props.max : 100}
             step={this.props.step ? this.props.step : 0.1}
             defaultValue={this.props.defaultValue ? this.props.defaultValue : 0}
             onChange={this.props.onChange}/>
    );
  }
});

export default Slider;
