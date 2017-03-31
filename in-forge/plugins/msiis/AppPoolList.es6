import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import List from 'in-sdk/components/sidebar/List';

export default function AppPoolList({ snapshot }) {
  const pools = snapshot.getIn(['data', 'allpools'], emptyList).toArray();
  if (!pools || pools.length === 0) {
    return null;
  }

  return (
    <List>
      {pools.map((pool, i) => (
        <List.Item key={i}>
          {pool}
        </List.Item>
      ))}
    </List>
  );
}
