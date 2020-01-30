import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getLinkToProfiles } from 'in-profiling/navigation/paths';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import Link from 'in-components/Link';

export default function Row({ item }) {
  const { processName, technologies, hostSnapshotPreview } = item;

  return (
    <Tr size="compact">
      <Td ellipsis="50vw">
        <Link
          href$={getLinkToProfiles({
            processSnapshotId: item.processSnapshotId
          })}
        >
          {processName}
        </Link>
      </Td>

      <Td noWrap>
        <TechnologyIndicatorList technologies={technologies} />
      </Td>

      <Td noWrap>
        <HostInformation hostSnapshotPreview={hostSnapshotPreview} />
      </Td>
    </Tr>
  );
}

function HostInformation({ hostSnapshotPreview }) {
  if (!hostSnapshotPreview) {
    return valueMissingPlaceholder;
  }

  return (
    <EntityLink
      plugin={hostSnapshotPreview.plugin}
      label={hostSnapshotPreview.label}
      href$={getDashboardLink(hostSnapshotPreview.id, { pathname: '/physical/dashboard' })}
    />
  );
}
