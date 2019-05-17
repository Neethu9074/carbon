import React from 'react';

import BadgeList from 'in-new-components/Badge/BadgeList';
import theme from 'in-themes';

export default function TypesBadgeList({ type, types }) {
  return <BadgeList type={type} types={types} getColor={() => theme.lib.colors.purple800} />;
}
