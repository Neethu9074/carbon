import React from 'react';

import { number } from 'in-services/formatters/number';

import locals from './CallsAndGroupsIndicator.mless';

export default function CallsAndGroupsIndicator({ numCalls, numGroups }) {
  return (
    <div className={locals.text}>
      <span className={locals.result}>Result</span>
      {`${number.compact(numCalls)} Calls${numGroups ? ` (in ${numGroups} Groups)` : ''}`}
    </div>
  );
}
