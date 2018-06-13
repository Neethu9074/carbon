import React from 'react';

import BasicFilter from 'in-analyze/Filter/BasicFilter';

import locals from './StaticFilter.mless';

export default function StaticFilter(props) {
  return <BasicFilter className={locals.filter} {...props} />;
}
