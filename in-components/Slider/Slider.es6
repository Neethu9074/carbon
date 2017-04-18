import rpt from 'prop-types';
import React from 'react';

import { getClassName } from 'in-services/react';

import './Slider.less';

const block = 'in-slider';

const Slider = React.createClass({
  propTypes: {
    onChange: rpt.func.isRequired,
    value: rpt.any,
    className: rpt.string,
    step: rpt.number,
    min: rpt.number,
    max: rpt.number
  },

  render() {
    return (
      <input
        type="range"
        className={getClassName(this, block)}
        min={this.props.min != null ? this.props.min : 0}
        max={this.props.max != null ? this.props.max : 100}
        step={this.props.step != null ? this.props.step : 0.1}
        value={this.props.value != null ? this.props.value : null}
        onChange={this.props.onChange}
      />
    );
  }
});

export default Slider;
