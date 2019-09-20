import React from 'react';

import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { stopPropagation } from 'in-services/util/function';
import Hierarchy from 'in-components/Link/Hierarchy';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './HierarchicalLinkPresenter.mless';

export default function HierarchicalLinkPresenter({
  useSnapshotFromHierarchyCallback,
  getLabel,
  hierarchySnapshots,
  hierarchy,
  href,
  kind,
  pathname,
  timeConfig,
  setExpanded,
  isExpanded,
  snapshot,
  useSnapshotLink
}) {
  if (useSnapshotFromHierarchyCallback) {
    snapshot = useSnapshotFromHierarchyCallback(snapshot, hierarchySnapshots);
  }
  const label = getSnapshotLabel(snapshot);

  const link = (
    <Link href={href} onClick={stopPropagation} className={locals.link}>
      <HealthyPluginIcon className={locals.pluginIcon} size="xxs" snapshot={snapshot} />
      {getLabel ? getLabel(label) : label}
    </Link>
  );

  if (!hierarchy || hierarchy.size < 2) {
    return link;
  }

  return (
    <div className={locals.link}>
      <SvgIcon
        className={locals.infoIcon}
        onClick={e => {
          stopPropagation(e);
          setExpanded(!isExpanded);
        }}
        type={isExpanded ? 'timeline_close' : 'timeline_open'}
        size="xxs"
      />
      {isExpanded ? (
        <Hierarchy
          hierarchy={hierarchy}
          kind={kind}
          hierarchySnapshots={hierarchySnapshots}
          useSnapshotLink={useSnapshotLink}
          pathname={pathname}
          timeConfig={timeConfig}
        />
      ) : (
        link
      )}
    </div>
  );
}
