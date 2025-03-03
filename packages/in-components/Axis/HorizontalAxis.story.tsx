/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import HorizontalAxis from 'in-components/Axis/HorizontalAxis';
import HorizontalAxis from 'in-components/Axis/HorizontalAxis';

export default {
  component: HorizontalAxis
};

export function Horizontal() {
  return (
    <>
      <HorizontalAxis align="top" scale={{ from: 0, to: 10 }} fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
      <HorizontalAxis align="bottom" scale={{ from: 0, to: 10 }} />
    </>
  );
}
