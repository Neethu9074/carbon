/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

// @ts-expect-error TS migration
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
import { createGroupBy } from 'in-analyze/navigation/paths';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { Nullish, Result, TimeConfig } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

interface RenderButtonLineSecondaryProps {
  timeConfig: TimeConfig;
  clusterId: string;
  kubernetesTimeShiftSelectTracker: TrackingFunction;
}

interface RenderButtonLineProps {
  clusterId: string;
  timeConfig: TimeConfig;
  result: Result<any>;
}

export default function ClusterDashboard() {
  const { location } = useNavigation();
  const timeConfig = useTimeConfig();
  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useKubernetesTracker();
  const props = {
    clusterId: getMatrixParameter(location, clusterDashboard, matrixClusterId),
    isOtelCluster: true,
    viewPath: clusterOtelDashboard,
    timeConfig
  };

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
        result$={getOtelKubernetesCluster({
          id: props.clusterId,
          timeConfig: props.timeConfig
        })}
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
              snapshotId={props.clusterId}
              timeConfig={timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />
      <Footer />
    </>
  );

  interface HeaderProps {
    result: Result<any> | Nullish;
    clusterId?: string | null;
    viewPath: string;
    timeConfig: TimeConfig;
    kubernetesTimeShiftSelectTracker: TrackingFunction;
  }

  function Header(props: HeaderProps) {
    const clusterDistribution = get(props, ['result', 'data', 'clusterDistribution'], 'kubernetes');
    const label = get(props.result, ['data', 'label']);
    return (
      <DashboardHeader
        {...props}
        title={t('in-kubernetes:dashboards.kubernetesCluster')}
        icon={`lib_${clusterDistribution}`}
        label={label}
        renderButtonLine={renderButtonLine}
        renderButtonLineSecondary={renderButtonLineSecondary}
        renderMetaInformation={renderMetaInformation}
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

  function renderButtonLine({ clusterId, timeConfig, result }: RenderButtonLineProps) {
    const clusterLabel = get(result, ['data', 'label'], '');

    return (
      <>
        <DashboardButtonLine
          snapshotId={clusterId}
          plugin={plugins.oTelK8sCluster}
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

  function renderMetaInformation({ result }: { result: Result<any> }) {
    const version = get(result, ['data', 'version']);
    const clusterDistribution = get(result, ['data', 'clusterDistribution'], 'kubernetes');
    const clusterManagement = get(result, ['data', 'clusterManagement']);
    return (
      <>
        {version && <BadgeList type={version} getColor={() => 'blue'} types={[]} />}
        <TypesBadgeList
          type={t('in-kubernetes:dashboards.clusterDistributionBadgeType', {
            clusterDistributionName: clusterBadgeName(clusterDistribution)
          })}
        />
        {clusterManagement && clusterManagement?.shortName !== 'none' && clusterManagement?.shortName !== '' && (
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
