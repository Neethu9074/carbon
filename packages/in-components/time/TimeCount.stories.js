/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import TimeCount from 'in-components/time/TimeCount';
import TimeCount from 'in-components/time/TimeCount';

export default {
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  component: TimeCount
};

export function Default() {
  return (
    <div style={{ background: '#00B3B3', padding: '1rem' }}>
      <TimeCount start={Date.now()} />
    </div>
  );
}
