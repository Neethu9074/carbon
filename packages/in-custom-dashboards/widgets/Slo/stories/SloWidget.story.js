/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';
import { Widget, demo } from 'in-custom-dashboards/widgets/Slo';

export default {
  component: Widget
};
const constTimeConfig = {
  from: 1,
  to: 1,
  windowSize: 60 * 1000
};

export function States() {
  return (
    <Stack>
      <TimeConfigContext.Provider value={constTimeConfig}>
        <Widget />
        <Widget title="Demo" config={demo} />
      </TimeConfigContext.Provider>
    </Stack>
  );
}
