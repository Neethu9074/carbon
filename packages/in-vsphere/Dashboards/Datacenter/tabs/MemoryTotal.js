import React from 'react';

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

import locals from './MemoryTotal.mless';

export default function MemoryTotal({ count }) {
  return <div className={locals.flexWrapper}>{count >= 0 && <span>{bytesTwoDecimalPlaces(count)}</span>}</div>;
}
