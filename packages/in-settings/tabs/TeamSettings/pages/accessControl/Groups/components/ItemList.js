import React from 'react';

import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function ItemList({ children: Content, timeConfig }) {
    return <Content timeConfig={timeConfig} />;
  }
);
