import React from 'react';

import List from 'in-sdk/components/sidebar/List';

export default function AppList({ snapshot }) {
  const apps = snapshot.getIn(['data', 'applications']);
  if (!apps || apps.size === 0) {
    return null;
  }

  return (
    <List>
      {apps
        .map((arg, i) => (
          <List.Item key={i}>
            {arg}
          </List.Item>
        ))
        .toArray()}
    </List>
  );
}
