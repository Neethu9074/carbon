import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getLinkToProfiles } from 'in-profiling/navigation/paths';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { Tr, Td } from 'in-components/tables/sharedComponents';

export default function Row({ item }) {
  const { processSnapshotId, time, entityLabel, entityPlugin, hostSnapshotPreview } = item;

  return (
    <Tr size="compact">
      <Td ellipsis="50vw">
        <EntityLink href$={getLinkToProfiles({ processSnapshotId, time })} plugin={entityPlugin} label={entityLabel} />
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
