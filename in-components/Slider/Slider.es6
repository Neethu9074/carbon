import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './Slider.less';

const block = 'in-slider';

export default function Slider({ onChange, value, className, step, min, max }) {
  return (
    <input
      type="range"
      className={evaluateClassNames({
        [block]: true,
        [className]: className
      })}
      min={min != null ? min : 0}
      max={max != null ? max : 100}
      step={step != null ? step : 0.1}
      value={value != null ? value : null}
      onChange={onChange}
    />
  );
}
