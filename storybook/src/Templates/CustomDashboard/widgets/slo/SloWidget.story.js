/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';
import { Widget, demo } from 'in-custom-dashboards/widgets/Slo';
import Stack from 'in-components/layout/Stack';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO',
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
