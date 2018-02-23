import React from 'react';

import Badge from 'in-new-components/Badge';

import locals from './Badge.mless';

export default function TableBadge(props) {
  return <Badge {...props} className={locals.badge} />;
}
