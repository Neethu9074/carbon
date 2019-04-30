import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';

import locals from './DateTime.mless';

export default function DateTime({ children }) {
  return <span className={locals.value}>{formatDateTime(children)}</span>;
}
