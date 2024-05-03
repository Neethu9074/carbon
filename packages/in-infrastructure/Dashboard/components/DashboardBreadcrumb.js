/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import PhysicalHierarchyBreadcrumb from 'in-infrastructure/Dashboard/components/PhysicalHierarchyBreadcrumb';
import CollapsedEntitiesBreadcrumb from 'in-infrastructure/Dashboard/components/CollapsedEntitiesBreadcrumb';
import { useGetCloseDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { selectedSnapshotId$, getPhysicalHierarchy } from 'in-stores/snapshot';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import getAgentSnapshotId from 'in-subscription/getAgentSnapshotId';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './DashboardBreadcrumb.mless';

export default connectTo(
  props => ({
    physicalHierarchy: getPhysicalHierarchy({ snapshotId: props.snapshotId }).map(_physicalHierarchy => {
      _physicalHierarchy = _physicalHierarchy.toArray();
      _physicalHierarchy.reverse();
      return _physicalHierarchy;
    }),
    selectedSnapshotId: selectedSnapshotId$,
    agent: isInternalVisible$
      .flatMap(enabled => (enabled ? getAgentSnapshotId(props.snapshot) : alwaysNull))
      // get snapshot to ensure that the agent snapshot can be found
      .flatMap(snapshotId => (snapshotId ? getSnapshot(snapshotId) : alwaysNull))
  }),
  function DashboardBreadcrumb({ physicalHierarchy, selectedSnapshotId, snapshotId, agent }) {
    const getCloseDashboardLink = useGetCloseDashboardLink();
    const homeBreadcrumb = (
      <Breadcrumb className={locals.homeBreadcrumb} href={getCloseDashboardLink}>
        {getHomeBreadcrumb(getCloseDashboardLink)}
      </Breadcrumb>
    );

    if (!physicalHierarchy) {
      return (
        <>
          <BreadcrumbHeader automaticActiveState={false} />
          <Breadcrumbs items={[homeBreadcrumb]} />
        </>
      );
    }

    physicalHierarchy = physicalHierarchy.slice();
    if (physicalHierarchy.length === 0) {
      physicalHierarchy.unshift(snapshotId);
    }

    if (agent) {
      physicalHierarchy.unshift(agent.get('id'));
    }

    return (
      <>
        <BreadcrumbHeader automaticActiveState={false} />
        <Breadcrumbs items={[homeBreadcrumb, ...collapseIds(physicalHierarchy, selectedSnapshotId)]} />
      </>
    );
  }
);

function getHomeBreadcrumb(closeDashboardLink) {
  if (closeDashboardLink.includes('#/table')) {
    return t('in-infrastructure:dashboard.comparisonTable');
  } else if (closeDashboardLink.includes('#/agents')) {
    return t('in-infrastructure:dashboard.agents');
  }
  return t('in-infrastructure:dashboard.map');
}

function collapseIds(ids, selectedId) {
  // cut all ids which are populated to the right of the selected id
  const indexOfSelectedId = ids.indexOf(selectedId);
  const itemsBeforeSelected = ids.slice(0, indexOfSelectedId);
  const itemsAfterSelected = ids.slice(indexOfSelectedId + 1);

  const collapsedBreadcrumbs = [<PhysicalHierarchyBreadcrumb snapshotId={selectedId} isActive />];

  if (itemsBeforeSelected.length > 0) {
    collapsedBreadcrumbs.unshift(<CollapsedEntitiesBreadcrumb ids={itemsBeforeSelected} />);
  }
  if (itemsAfterSelected.length > 0) {
    collapsedBreadcrumbs.push(<CollapsedEntitiesBreadcrumb ids={itemsAfterSelected} light />);
  }

  return collapsedBreadcrumbs;
}
