/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytes, millis, percentage } from 'in-services/formatters/number';
import VerticalAxis from 'in-components/Axis/VerticalAxis';

export default {
  component: VerticalAxis
};

export function Time() {
  return <VerticalAxis formatter={millis} scale={{ from: 0, to: 1234 }} />;
}

export function BytesGib(props) {
  return (
    <VerticalAxis
      formatter={bytes}
      scale={{
        from: 0,
        to: props['scaleTo GiB']
      }}
    />
  );
}
BytesGib.args = {
  'scaleTo GiB': 800000000000
};
BytesGib.argTypes = {
  'scaleTo GiB': {
    control: {
      type: 'range',
      min: 0,
      max: 2000000000000,
      step: 200000000000
    }
  }
};

export function BytesMiiB(props) {
  return (
    <VerticalAxis
      formatter={bytes}
      scale={{
        from: 0,
        to: props['scaleTo MiB']
      }}
    />
  );
}
BytesMiiB.args = {
  'scaleTo MiB': 500677236
};
BytesMiiB.argTypes = {
  'scaleTo MiB': {
    control: {
      type: 'range',
      min: 0,
      max: 2000000000,
      step: 100000000
    }
  }
};

export function Percentage() {
  return <VerticalAxis formatter={percentage} scale={{ from: 0, to: 0.95 }} />;
}

export function Numbers(props) {
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
          to: props['scaleTo numbers']
        }}
      />
    </div>
  );
}
Numbers.args = {
  'scaleTo numbers': 10000
};
Numbers.argTypes = {
  'scaleTo numbers': {
    control: {
      type: 'range',
      min: 0,
      max: 25000,
      step: 2500
    }
  }
};
