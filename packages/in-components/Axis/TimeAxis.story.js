/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import HorizontalTimeAxis from 'in-components/Axis/HorizontalTimeAxis';
import HorizontalTimeAxis from 'in-components/Axis/HorizontalTimeAxis';

export default {
  component: HorizontalTimeAxis
};

export function TimeAxis() {
  return (
    <>
      <HorizontalTimeAxis align="bottom" scale={{ from: 1521117675027, to: 1521118875027 }} />
      <br />
      <HorizontalTimeAxis align="bottom" scale={{ from: 1521117675027, to: 1521117875027 }} />
      <br />
      <HorizontalTimeAxis align="bottom" scale={{ from: 1521117675027, to: 1521117735027 }} />
      <br />
      <HorizontalTimeAxis align="bottom" scale={{ from: 1532732400000, to: 1532815200000 }} />
      <br />
      <HorizontalTimeAxis align="bottom" scale={{ from: 1532210400000, to: 1532815200000 }} />
    </>
  );
}
