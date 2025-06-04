/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';

//@ts-expect-error TS migration
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
//@ts-expect-error TS migration
import { clusterBadgeName, isOpenshift } from 'in-kubernetes/clusterDistributions';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
//@ts-expect-error TS migration
import EntityWithTypeAndIcon from 'in-components/EntityWithTypeAndIcon';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
//@ts-expect-error TS migration
import EntityVersionList from 'in-components/EntityVersionList';
//@ts-expect-error TS migration
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
//@ts-expect-error TS migration
import { ClusterBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import getOtelKubernetesCluster from 'in-kubernetes/subscriptions/getOtelKubernetesCluster';
import { clusterDashboard, clusterOtelDashboard } from 'in-kubernetes/navigation/paths';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import { TrackingFunction, useKubernetesTracker } from 'in-kubernetes/tracker';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import tabs from 'in-kubernetes/Dashboards/Cluster/tabs/OtelIndex';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { pageNames } from 'in-services/tracking/pageNames';
import BadgeList from 'in-components/BadgeList/BadgeList';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export interface ClusterData {
  clusterDistribution: string;
  clusterManagement: ClusterManagement;
  clusterId: string;
  label: string;
  missingAppsPermission: boolean;
  version: string;
}

interface ClusterManagement {
  fullName: string;
  shortName: string;
}

interface RenderButtonLineSecondaryProps {
  timeConfig: TimeConfig;
  clusterId: string;
  kubernetesTimeShiftSelectTracker: TrackingFunction;
}

interface RenderButtonLineProps {
  clusterId: string;
  timeConfig: TimeConfig;
  clusterData: ClusterData;
}

export default function ClusterDashboard() {
  const { location } = useNavigation();
  const timeConfig = useTimeConfig();
  const clusterId = getMatrixParameter(location, clusterDashboard, matrixClusterId);
  const clusterData = useObservable(getOtelKubernetesCluster({ id: clusterId, timeConfig: timeConfig }), [clusterId])
    ?.data as ClusterData;
  const props = {
    clusterId,
    viewPath: clusterOtelDashboard,
    timeConfig
  };
  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useKubernetesTracker();

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.cluster_summary
        }}
      />

      <Breadcrumbs items={ClusterBreadcrumbs(props)} />

      <TabView
        HeaderComponent={props => (
          <Header {...props} kubernetesTimeShiftSelectTracker={kubernetesTimeShiftSelectTracker} />
        )}
        location={location}
        // @ts-expect-error
        tabs={tabs}
        tabChangeTracker={e =>
          k8sTabChange({
            ...e,
            dashboard: 'cluster',
            path: location.pathname
          })
        }
        filterTabByResult={result => {
          return tab => {
            if (isOpenshift(get(result, ['data', 'clusterDistribution'], 'kubernetes'))) return true;
            else return !tab.path.endsWith('/deploymentconfigs');
          };
        }}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesCluster}
              snapshotId={clusterData?.clusterId}
              timeConfig={timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />

      <Footer />
    </>
  );

  function Header(props: any) {
    return (
      <DashboardHeader
        {...props}
        title={t('in-kubernetes:dashboards.kubernetesCluster')}
        icon={`lib_${clusterData?.clusterDistribution}`}
        label={clusterData?.label}
        renderButtonLine={renderButtonLine}
        renderButtonLineSecondary={renderButtonLineSecondary}
        renderMetaInformation={RenderMetaInformation}
      />
    );
  }

  function renderButtonLineSecondary({
    timeConfig,
    clusterId,
    kubernetesTimeShiftSelectTracker
  }: RenderButtonLineSecondaryProps) {
    return (
      <>
        {beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled && (
          <TimeShiftDropdown
            onChange={offset =>
              kubernetesTimeShiftSelectTracker({
                area: 'pod',
                offset: getTimeShiftLabel({ offset: offset }),
                windowSize: timeConfig.windowSize,
                autoRefresh: timeConfig.autoRefresh
              })
            }
            disabled={false}
          />
        )}
        <RenderButtonLineSecondary timeConfig={timeConfig} snapshotId={clusterId} />
      </>
    );
  }

  function renderButtonLine({ clusterId, timeConfig, clusterData }: RenderButtonLineProps) {
    const clusterLabel = clusterData?.label;

    return (
      <>
        <DashboardButtonLine
          snapshotId={clusterId}
          plugin={plugins.kubernetesCluster}
          timeConfig={timeConfig}
          tagFilters={[]}
        />

        <AnalyzeCallsButton
          clusterName={clusterLabel}
          groupBy={createGroupBy('kubernetes.namespace.name', DESTINATION)}
        />
      </>
    );
  }

  function RenderMetaInformation() {
    const version = clusterData?.version;
    const clusterDistribution = clusterData?.clusterDistribution ?? 'kubernetes';
    const clusterManagement = clusterData?.clusterManagement;
    return (
      <>
        {version && <BadgeList type={version} getColor={() => 'blue'} types={[]} />}
        <TypesBadgeList
          type={t('in-kubernetes:dashboards.clusterDistributionBadgeType', {
            clusterDistributionName: clusterBadgeName(clusterDistribution)
          })}
        />
        {clusterManagement && clusterManagement?.shortName !== 'none' && (
          <EntityWithTypeAndIcon
            iconType={`lib_${clusterManagement?.shortName}`}
            label={t('in-kubernetes:dashboards.managedby', {
              name: clusterManagement?.fullName
            })}
          />
        )}
      </>
    );
  }
}
