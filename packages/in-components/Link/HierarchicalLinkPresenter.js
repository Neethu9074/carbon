/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { stopPropagation } from 'in-services/util/function';
import Hierarchy from 'in-components/Link/Hierarchy';

import locals from './HierarchicalLinkPresenter.mless';

export default function HierarchicalLinkPresenter({
  useSnapshotFromHierarchyCallback: getSnapshotFromHierarchyCallback,
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
  if (getSnapshotFromHierarchyCallback) {
    snapshot = getSnapshotFromHierarchyCallback(snapshot, hierarchySnapshots);
  }

  const label = getSnapshotLabel(snapshot);

  const link = (
    <Link href={href} onClick={stopPropagation} className={locals.link}>
      <HealthyPluginIcon className={locals.pluginIcon} snapshot={snapshot} size="xs" />
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
        type={isExpanded ? 'lib_openclose_remove_circle_outline' : 'lib_openclose_add_circle_outline'}
        size="xs"
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
