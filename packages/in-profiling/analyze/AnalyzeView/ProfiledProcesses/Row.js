import React from 'react';

import TechnologyListing from 'in-profiling/analyze/AnalyzeView/commonComponents/TechnologyListing';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { getLinkToProfiles } from 'in-profiling/navigation/paths';
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
        <TechnologyListing technologies={technologies} />
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
      snapshot={hostSnapshotPreview}
      href$={getDashboardLink(hostSnapshotPreview.id, { pathname: '/physical/dashboard' })}
    />
  );
}
