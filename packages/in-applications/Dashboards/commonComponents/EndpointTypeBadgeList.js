import React from 'react';

import BadgeList from 'in-new-components/Badge/BadgeList';
import { getColor } from 'in-applications/endpointTypes';

export default function EndpointTypeBadgeList({ type, types }) {
  return <BadgeList type={type} types={types} getColor={getColor} />;
}
