import React from 'react';

import StackGroup from 'in-new-components/Stack/components/StackGroup';

export default function StackPane({ groups }) {
  if (!groups.length) {
    return <div style={{ padding: '1.5em' }}>No Data to Display</div>;
  }

  return groups.map(group => <StackGroup key={group.relationship} group={group} />);
}
