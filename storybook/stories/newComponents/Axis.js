import { storiesOf } from '@storybook/react';
import React from 'react';

import HorizontalTimeAxis from 'in-new-components/Axis/HorizontalTimeAxis';
import { bytes, millis, percentage } from 'in-services/formatters/number';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';

import Root from '../_helpers/Root';

storiesOf('newComponents/Axis', module)
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
          </div>
        </AxisType>
        <AxisType type="Percentage">
          <VerticalAxis formatter={percentage} scale={{ from: 0, to: 0.95 }} />
        </AxisType>
        <AxisType type="Bytes">
          <VerticalAxis formatter={bytes} scale={{ from: 0, to: 2384677236 }} />
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
