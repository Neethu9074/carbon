import rpt from 'prop-types';
import React from 'react';

import { number } from 'in-services/formatters/number';

import locals from './ResultHeader.mless';

export default function ResultHeader({ itemName, totalRepresentedItemCount }) {
  return (
    <div className={locals.wrapper}>
      <span className={locals.result}>Result</span>
      <span className={locals.number}>{formatCounter(totalRepresentedItemCount, itemName)}</span>
    </div>
  );
}

ResultHeader.propTypes = {
  itemName: rpt.string.isRequired,
  totalRepresentedItemCount: rpt.number
};

function formatCounter(count, itemName) {
  if (count != null) {
    return `${number.compact(count)} ${itemName}${count === 1 ? '' : 's'}`;
  }
  return 'Loading…';
}
