import React from 'react';

import StackGroup from 'in-new-components/Stack/components/StackGroup';

export default function StackPane({ groups }) {
  return groups.map(group => <StackGroup key={group.relationship} group={group} />);
}
