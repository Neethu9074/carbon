import { withKnobs, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import HorizontalTimeAxis from 'in-new-components/Axis/HorizontalTimeAxis';
import { bytes, millis, percentage } from 'in-services/formatters/number';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';

import Root from '../_helpers/Root';

storiesOf('Components/Axis', module)
  .addDecorator(withKnobs)
  .add('horizontal', () => <Horizontal />)
  .add('vertical', () => <Vertical />);

function Horizontal() {
  return (
    <Root>
      <AxisType type="Numbers">
        <HorizontalAxis align="top" scale={{ from: 0, to: 10 }} fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
        <HorizontalAxis align="bottom" scale={{ from: 0, to: 10 }} />
      </AxisType>
      <AxisType type="Time Based">
        <HorizontalTimeAxis align="bottom" scale={{ from: 1521117675027, to: 1521118875027 }} />
        <br />
        <HorizontalTimeAxis align="bottom" scale={{ from: 1521117675027, to: 1521117875027 }} />
        <br />
        <HorizontalTimeAxis align="bottom" scale={{ from: 1521117675027, to: 1521117735027 }} />
        <br />
        <HorizontalTimeAxis align="bottom" scale={{ from: 1532732400000, to: 1532815200000 }} />
        <br />
        <HorizontalTimeAxis align="bottom" scale={{ from: 1532210400000, to: 1532815200000 }} />
      </AxisType>
    </Root>
  );
}

function Vertical() {
  return (
    <Root>
      <div style={{ display: 'flex' }}>
        <AxisType type="Numbers">
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
        </AxisType>
        <AxisType type="Percentage">
          <VerticalAxis formatter={percentage} scale={{ from: 0, to: 0.95 }} />
        </AxisType>
        <AxisType type="Bytes (MiB)">
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
        </AxisType>
        <AxisType type="Bytes (GiB)">
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
        </AxisType>
        <AxisType type="Time">
          <VerticalAxis formatter={millis} scale={{ from: 0, to: 1234 }} />
        </AxisType>
      </div>
    </Root>
  );
}

function AxisType({ type, children }) {
  return (
    <div style={{ marginRight: 48 }}>
      <h2>{type}</h2>
      {children}
    </div>
  );
}
