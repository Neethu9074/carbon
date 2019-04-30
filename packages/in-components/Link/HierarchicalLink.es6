import { combineLatest } from 'reactive-observables';
import { compose, withState } from 'recompose';
import React from 'react';

import { getSnapshot, shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { joinClassNames } from 'in-services/util/classnames';
import { stopPropagation } from 'in-services/util/function';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import Hierarchy from 'in-components/Link/Hierarchy';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './HierarchicalLink.mless';

export default compose(
  connect(({ snapshot, timeConfig }) => ({
    timeConfig: shouldStayInCurrentTimeModeForNavigationToSnapshot({ snapshotId: snapshot.get('id') }).map(
      stay => (stay ? undefined : timeConfig)
    )
  })),
  connect(
    ({ snapshot, timeConfig, useSnapshotLink, pathname, calculateHierarchy, useSnapshotFromHierarchyCallback }) => {
      const snapshotId = snapshot.get('id');

      const observables = {
        href: useSnapshotLink
          ? getLinkToSnapshotInCurrentView(snapshotId, { timeConfig: timeConfig })
          : getDashboardLink(snapshotId, {
              pathname: pathname,
              timeConfig: timeConfig
            }),
        hierarchy: calculateHierarchy ? getPhysicalHierarchy(snapshotId, false, timeConfig) : alwaysNull
      };
      if (useSnapshotFromHierarchyCallback) {
        observables.hierarchySnapshots = observables.hierarchy.flatMap(hierarchy =>
          combineLatest(hierarchy.toArray().map(id => getSnapshot(id, timeConfig)))
        );
      }
      return observables;
    }
  ),
  withState('isExpanded', 'setExpanded', false)
)(HierarchicalLink);

function HierarchicalLink({
  useSnapshotFromHierarchyCallback,
  getLabel,
  hierarchySnapshots,
  hierarchy,
  className,
  href,
  kind,
  linkClassName: customLinkClassName,
  pathname,
  timeConfig,
  setExpanded,
  isExpanded,
  snapshot,
  onClick: onClickProp,
  useSnapshotLink
}) {
  const linkClassName = `${locals.link} ${kind === 'dark' ? locals.dark : locals.light}`;
  if (useSnapshotFromHierarchyCallback) {
    snapshot = useSnapshotFromHierarchyCallback(snapshot, hierarchySnapshots);
  }
  const label = getSnapshotLabel(snapshot);

  const link = (
    <Link
      href={href}
      onClick={stopPropagation}
      className={joinClassNames(linkClassName, className, customLinkClassName)}
    >
      <HealthyPluginIcon
        className={locals.pluginIcon}
        snapshot={snapshot}
        fallbackColor={kind === 'dark' ? '#000' : '#fff'}
        dimension={12}
        timeConfig={timeConfig}
      />
      {getLabel ? getLabel(label) : label}
    </Link>
  );

  if (!hierarchy || hierarchy.size < 2) {
    return link;
  }

  return (
    <div className={locals.link}>
      <SvgIcon
        className={`${locals.infoIcon} ${locals.infoIcon}--${kind}`}
        onClick={e => {
          stopPropagation(e);
          setExpanded(!isExpanded);

          if (onClickProp) {
            onClickProp();
          }
        }}
        type={isExpanded ? 'timeline_close' : 'timeline_open'}
        width={12}
        height={12}
      />
      {isExpanded ? (
        <Hierarchy
          hierarchy={hierarchy}
          kind={kind}
          hierarchySnapshots={hierarchySnapshots}
          useSnapshotLink={useSnapshotLink}
          linkClassName={customLinkClassName}
          pathname={pathname}
          timeConfig={timeConfig}
        />
      ) : (
        link
      )}
    </div>
  );
}
