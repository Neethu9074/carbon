/* eslint-disable max-len */

import React from 'react';

import './PhysicalSummary.less';

const block = 'table-view-physical-summary';

export default function PhysicalSummary({zones}) {
  const hostCount = zones.reduce((count, zone) => {
    return count + zone.get('children').size;
  }, 0);

  return (
    <p className={block}>
      <em>{hostCount} {simplePluralize('Host', hostCount)}</em> in <em>{zones.length} {simplePluralize('Zone', zones.length)}</em>
    </p>
  );
}


function simplePluralize(word, count) {
  if (count === 1) {
    return word;
  }
  return `${word}s`;
}
