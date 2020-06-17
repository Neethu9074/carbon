import DistinctSlider from '../../Slider/DistinctSlider';
import React from 'react';

export const SensitivitySlider = ({ value, onChange }) => {
  const ln4 = Math.log(4);
  const expoValue = x => '' + Math.round(Math.exp((2 - x) * ln4) * 200) / 200;
  const labeledTicks = [{ value: 0, label: 'low' }, { value: 1 }, { value: 2, label: 'high' }];

  return (
    <DistinctSlider
      valueLabelDisplay="off"
      marks={labeledTicks}
      min={0}
      max={2}
      step={2 / 600}
      value={2 - Math.log(value) / ln4}
      onChange={sliderValue => {
        onChange(expoValue(sliderValue));
      }}
    />
  );
};
