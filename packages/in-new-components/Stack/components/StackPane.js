import React from 'react';

import StackGroup from 'in-new-components/Stack/components/StackGroup';
import ScrollHints from 'in-components/ScrollHints';

import locals from './StackPane.mless';

export default function StackPane({ groups }) {
  if (!groups.length) {
    return <div style={{ padding: '1.5em' }}>No Data to Display</div>;
  }

  return (
    <ScrollHints className={locals.pane} contentChangeMarker={groups.length}>
      {groups.map(group => (
        <StackGroup key={group.relationship} group={group} />
      ))}
    </ScrollHints>
  );
}
