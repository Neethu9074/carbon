import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import VersionTimeline from 'in-new-components/VersionTimeline';
import Root from '../_helpers/Root';

storiesOf('Components/Version Timeline', module).add('Version Timeline', () => <VersionTimelineStory />);

const now = Date.now();

function VersionTimelineStory() {
  const [selectedVersion, setSelectedVersion] = useState(null);

  const from = now - 1000 * 60 * 60;

  return (
    <Root>
      <VersionTimeline
        versions={[{ from: from + 1000 * 60, to: now - 1000 * 60 }]}
        from={from}
        to={now}
        onVersionClick={version =>
          setSelectedVersion(selectedVersion && selectedVersion.from === version.from ? null : version)
        }
        selectedVersion={selectedVersion}
      />
    </Root>
  );
}
