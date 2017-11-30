import React from 'react';

import getForgeComponent from 'in-services/getForgeComponent';

export default function SnapshotForgeInfo({ snapshot }) {
  if (!snapshot) {
    return null;
  }

  const Info = getForgeSpecificComponent(snapshot);
  return <Info snapshot={snapshot} />;
}

function getForgeSpecificComponent(snapshot) {
  return getForgeComponent('./' + snapshot.get('plugin') + '/Info.es6');
}
