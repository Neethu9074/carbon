import { withKnobs, number } from '@storybook/addon-knobs';
import React from 'react';

import { bytes, millis, percentage } from 'in-services/formatters/number';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';

export default {
  title: 'Atoms/Axis/Vertical',
  component: VerticalAxis,
  decorators: [withKnobs]
};

export function Time() {
  return <VerticalAxis formatter={millis} scale={{ from: 0, to: 1234 }} />;
}
export function BytesGib() {
  return (
    <VerticalAxis
      formatter={bytes}
      scale={{
        from: 0,
        to: number('scaleTo GiB', 800000000000, {
          range: true,
          min: 0,
          max: 2000000000000,
          step: 200000000000
        })
      }}
    />
  );
}
export function BytesMiiB() {
  return (
    <VerticalAxis
      formatter={bytes}
      scale={{
        from: 0,
        to: number('scaleTo MiB', 500677236, {
          range: true,
          min: 0,
          max: 2000000000,
          step: 100000000
        })
      }}
    />
  );
}
export function Percentage() {
  return <VerticalAxis formatter={percentage} scale={{ from: 0, to: 0.95 }} />;
}
export function Numbers() {
  return (
    <div style={{ display: 'flex' }}>
      <VerticalAxis
        align="left"
        scale={{ from: 0, to: 10 }}
        fixedTickPositions={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
      />
      <VerticalAxis align="right" scale={{ from: 0, to: 10 }} />
      <VerticalAxis align="left" scale={{ from: 0, to: 0 }} />
      <VerticalAxis align="left" scale={{ from: 0, to: 1 }} />
      <VerticalAxis
        align="left"
        scale={{
          from: 0,
          to: number('scaleTo numbers', 10000, {
            range: true,
            min: 0,
            max: 25000,
            step: 2500
          })
        }}
      />
    </div>
  );
}
