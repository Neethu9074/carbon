import React, { Fragment } from 'react';
import { get } from 'lodash';

import ErroneousEntityVersionList from 'in-kubernetes/Dashboards/commonComponents/ErroneousEntityVersionList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import { clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { clusterDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { ClusterBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Cluster/tabs/index';
import BadgeList from 'in-new-components/Badge/BadgeList';
import { getTimeConfig } from 'in-stores/time/config';
import theme from 'in-themes';

export default function ClusterDashboard({ location }) {
  const props = {
    clusterId: getMatrixParameter(location, clusterDashboard, matrixClusterId),
    viewPath: clusterDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={ClusterBreadcrumbs(props)} />

      <TabView
        result$={getKubernetesCluster({
          id: props.clusterId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        filterTabByResult={result => {
          return tab => {
            if (get(result, ['data', 'distributionType'], 'Kubernetes') === 'OpenShift') return true;
            else return tab.label !== 'Deployment Configs';
          };
        }}
        props={props}
        renderErrors={errors => (
          <ErroneousEntityVersionList snapshotId={props.clusterId} timeConfig={props.timeConfig} errors={errors} />
        )}
      />
    </Fragment>
  );
}

function Header(props) {
  const distributionType = get(props, ['result', 'data', 'distributionType'], 'Kubernetes');
  const clusterIcon = `lib_${distributionType.toLowerCase()}`;

  return (
    <BasicDashboardHeader
      title="Cluster"
      icon={clusterIcon}
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}

function Actions({ clusterId, timeConfig, result }) {
  return (
    <Fragment>
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'label'])}
        groupByTag={{ name: 'kubernetes.namespace' }}
        timeConfig={timeConfig}
      />
      <EntityHealthIndicator
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={clusterId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  const version = get(result, ['data', 'version']);
  return (
    <Fragment>
      {version && <BadgeList type={version} getColor={() => theme.lib.colors.N700Medium} />}
      <TypesBadgeList type="K8s Cluster" />
    </Fragment>
  );
}
