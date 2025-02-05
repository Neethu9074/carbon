/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardHeaderButtonSection from 'in-infrastructure/Dashboard/components/DashboardHeaderButtonSection';
import { analyzeRelatedInstancesButtonEnabled, vulnerabilityCenterEnabled } from 'in-services/featureFlags';
import AnalyzeRelatedInstancesButton from 'in-infrastructure/components/AnalyzeRelatedInstancesButton';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import EntityCveIndicator from 'in-components/EntityCveIndicator/EntityHealthIndicatorBehavior';
import DashboardBreadcrumb from 'in-infrastructure/Dashboard/components/DashboardBreadcrumb';
import CveIndicatorButtonPresenter from 'in-components/health/CveIndicatorButtonPresenter';
import PluginBadge from 'in-infrastructure/Dashboard/components/PluginBadge';
import { defaultAllInfraGroup } from 'in-infrastructure/Explore/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useSegmentTracker } from 'in-infrastructure/tracking/tracking';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import { getRelatedInstancesTagFilterCallback } from 'in-sdk/tagFilter';
import ZoneTag from 'in-map/components/MapSidebar/components/ZoneTag';
import DashboardHeaderComponent from 'in-components/DashboardHeader';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import { getShowZoneInSidebarHeader } from 'in-sdk/snapshot';
import PluginIcon from 'in-components/PluginIcon';
import { plugins } from 'in-forge/constants';

import locals from './DashboardHeader.mless';

export default function DashboardHeader(props) {
  const { snapshot, title, snapshotId } = props;
  const { location } = useNavigation();
  const { trackAnalyzeInfrastructureButtonClicked: trackAnalyzeRelatedInstancesButtonClicked } = useSegmentTracker();
  return (
    <>
      <DashboardBreadcrumb snapshotId={snapshotId} snapshot={snapshot} title={title} />
      <div className={locals.dashboardHeader}>
        <DashboardHeaderComponent
          {...props}
          title={title}
          snapshot={snapshot}
          renderIcon={() => <PluginIcon className={locals.icon} snapshot={snapshot} />}
          label={snapshot.get('label')}
          renderButtonLine={props =>
            renderButtonLine({ ...props, path: location.pathname, trackAnalyzeRelatedInstancesButtonClicked })
          }
          renderButtonLineSecondary={renderButtonLineSecondary}
          renderMetaInformation={renderMetaInformation}
        />
      </div>
    </>
  );
}

function renderButtonLine(props) {
  const { snapshot, timeConfig, path, trackAnalyzeRelatedInstancesButtonClicked } = props;
  const plugin = snapshot.get('plugin');
  const getTagFilter = analyzeRelatedInstancesButtonEnabled ? getRelatedInstancesTagFilterCallback(plugin) : undefined;
  const analyzeRelatedInstancesTagFilter = getTagFilter ? getTagFilter(snapshot) : undefined;

  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={props => <HealthIndicatorButtonPresenter size="normal" {...props} />}
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
      />

      {vulnerabilityCenterEnabled && isContainer(snapshot) && (
        <EntityCveIndicator
          IndicatorPresenter={props => <CveIndicatorButtonPresenter size="normal" {...props} />}
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
        />
      )}

      {![plugins.instanaAgent].includes(snapshot.get('plugin')) && (
        <ContextGuide
          id={snapshot.get('id')}
          timeConfig={timeConfig}
          tagFilters={getSnapshotIdTagFilter(snapshot)}
          plugin={snapshot.get('plugin')}
          size="normal"
        />
      )}

      {analyzeRelatedInstancesTagFilter && (
        <AnalyzeRelatedInstancesButton
          tagFilterExpression={analyzeRelatedInstancesTagFilter}
          type={snapshot.get('plugin')}
          timeConfig={timeConfig}
          group={defaultAllInfraGroup}
          onClick={() => trackAnalyzeRelatedInstancesButtonClicked({ plugin, path })}
        />
      )}
    </>
  );
}

function renderButtonLineSecondary(props) {
  const { snapshot, timeConfig } = props;
  return <DashboardHeaderButtonSection snapshot={snapshot} snapshotId={snapshot.get('id')} timeConfig={timeConfig} />;
}

function renderMetaInformation({ snapshot, plugin }) {
  return (
    <>
      <PluginBadge plugin={plugin} />
      {getShowZoneInSidebarHeader(plugin) && <ZoneTag snapshotId={snapshot.get('id')} />}
    </>
  );
}

function getSnapshotIdTagFilter(snapshot) {
  const plugin = snapshot.get('plugin');
  const id = snapshot.get('id');
  if (plugin === 'host') {
    return [{ name: 'host.snapshotId', value: id, operator: 'EQUALS' }];
  } else if (isContainer(snapshot)) {
    return [{ name: 'container.snapshotId', value: id, operator: 'EQUALS' }];
  } else if (plugin === 'awsRds' || plugin === 'awsEs') {
    return [{ name: 'cloud.snapshotId', value: id, operator: 'EQUALS' }];
  } else {
    return [{ name: 'process.snapshotId', value: id, operator: 'EQUALS' }];
  }
}

function isContainer(snapshot) {
  const plugin = snapshot.get('plugin');
  const containerPlugins = ['docker', 'crio', 'garden', 'containerd', 'awsEcsContainer', 'podman'];
  return containerPlugins.includes(plugin);
}
