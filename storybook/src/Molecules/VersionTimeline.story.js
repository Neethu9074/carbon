/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import VersionTimeline from 'in-components/VersionTimeline';
import { hours, minutes } from 'in-services/time';

export default {
  title: 'Molecules|VersionTimeline',
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  component: VersionTimeline
};

const now = Date.now();
export function Default() {
  const [selectedVersion, setSelectedVersion] = useState(null);

  const min = minutes.toMillis(1);
  const from = now - hours.toMillis(1);

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
