import DistinctSlider from '../../Slider/DistinctSlider';
import React from 'react';

export const SensitivitySlider = ({ value, onChange }) => {
  const ln5 = Math.log(5);
  const expoValue = x => '' + Math.round(Math.exp(x * ln5) * 200) / 200;
  const labeledTicks = [{ value: 0, label: 'high' }, { value: 1 }, { value: 2, label: 'low' }];

  return (
    <DistinctSlider
      valueLabelDisplay="auto"
      valueLabelFormat={expoValue}
      marks={labeledTicks}
      min={0}
      max={2}
      step={2 / 600}
      value={Math.log(value) / ln5}
      onChange={sliderValue => {
        onChange(expoValue(sliderValue));
      }}
    />
  );
};
