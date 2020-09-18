import React, { useState } from 'react';

import VersionTimeline from 'in-new-components/VersionTimeline';

export default {
  title: 'Molecules/VersionTimeline',
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  component: VersionTimeline
};

const now = Date.now();

export function Default() {
  const [selectedVersion, setSelectedVersion] = useState(null);

  const min = 1000 * 60;
  const from = now - min * 60;

  return (
    <VersionTimeline
      versions={[
        { from: from + min, to: from + 2 * min },
        { from: from + 3 * min, to: from + 4 * min },
        { from: from + 5 * min, to: from + 6 * min },
        { from: from + 6 * min, to: from + 50 * min }
      ]}
      from={from}
      to={now}
      onVersionClick={version =>
        setSelectedVersion(selectedVersion && selectedVersion.from === version.from ? null : version)
      }
      selectedVersion={selectedVersion}
    />
  );
}
