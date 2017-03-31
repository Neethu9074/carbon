import React from 'react';

import List from 'in-sdk/components/sidebar/List';

export default function ArgList({ snapshot }) {
  const args = snapshot.getIn(['data', 'args']);
  if (!args || args.size === 0) {
    return null;
  }

  return (
    <List>
      {args
        .map((arg, i) => (
          <List.Item key={i}>
            {arg}
          </List.Item>
        ))
        .toArray()}
    </List>
  );
}
