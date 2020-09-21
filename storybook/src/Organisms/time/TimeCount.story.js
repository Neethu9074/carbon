import React from 'react';

import TimeCount from 'in-new-components/time/TimeCount';

export default {
  title: 'Organisms|time/TimeCount',
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
