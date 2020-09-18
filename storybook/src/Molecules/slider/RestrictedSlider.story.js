import React, { useState } from 'react';

import DebouncedRestrictedSlider from 'in-new-components/Slider/DebouncedRestrictedSlider';
import RestrictedSlider from 'in-new-components/Slider/RestrictedSlider';

export default {
  title: 'Molecules/slider/Sliders/restrictedValues'
};

export const withNumericScale = () => {
  const marks = [
    {
      value: 1,
      label: '1 min'
    },
    {
      value: 5,
      label: '5 min'
    },
    {
      value: 10,
      label: '10 min'
    },
    {
      value: 30,
      label: '30 min'
    }
  ];
  const [value, setValue] = useState(marks[0].value);
  return (
    <RestrictedSlider
      marks={marks}
      min={0}
      valueLabelFormat={x => x + ' min'}
      max={marks[marks.length - 1].value}
      value={value}
      onChange={value => {
        setValue(value);
      }}
    />
  );
};
export const equidistantCumulative = () => {
  const marks = [
    {
      value: 1,
      label: 'hourly'
    },
    {
      value: 2,
      label: 'daily'
    },
    {
      value: 3,
      label: 'weekly'
    },
    {
      value: 4,
      label: 'monthly'
    }
  ];
  const [value, setValue] = useState(marks[2].value);
  return <RestrictedSlider valueLabelDisplay="off" marks={marks} min={1} max={4} value={value} onChange={setValue} />;
};

export const withPermanentLabel = () => {
  const marks = [
    {
      value: 0,
      label: 'slow',
      valueLabel: '5s'
    },
    {
      value: 1,
      label: 'medium',
      valueLabel: '250ms'
    },
    {
      value: 2,
      label: 'fast',
      valueLabel: '10ms'
    }
  ];
  const [value, setValue] = useState(marks[1].value);

  return (
    <RestrictedSlider
      valueLabelDisplay="on"
      valueLabelFormat={v => marks[v].valueLabel}
      marks={marks}
      min={0}
      max={2}
      value={value}
      onChange={setValue}
    />
  );
};

export const Disabled = () => {
  const marks = [
    {
      value: 0,
      label: 'slow',
      valueLabel: '5s'
    },
    {
      value: 1,
      label: 'medium',
      valueLabel: '250ms'
    },
    {
      value: 2,
      label: 'fast',
      valueLabel: '10ms'
    }
  ];
  const [value, setValue] = useState(1);

  return (
    <RestrictedSlider
      disabled
      valueLabelDisplay="on"
      marks={marks}
      min={0}
      max={2}
      value={value}
      onChange={value => {
        setValue(value);
      }}
    />
  );
};

export const Debounced = () => {
  const marks = [
    {
      value: 1,
      label: '1 min'
    },
    {
      value: 5,
      label: '5 min'
    },
    {
      value: 10,
      label: '10 min'
    },
    {
      value: 30,
      label: '30 min'
    }
  ];
  const [value, setValue] = useState(marks[0].value);
  return (
    <DebouncedRestrictedSlider
      marks={marks}
      min={0}
      valueLabelFormat={x => x + ' min'}
      max={marks[marks.length - 1].value}
      value={value}
      onChange={value => {
        setValue(value);
      }}
    />
  );
};
