import React, { Fragment } from 'react';
import { get } from 'lodash';

import ErroneousEntityVersionList from 'in-kubernetes/Dashboards/commonComponents/ErroneousEntityVersionList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { podId as matrixPodId } from 'in-kubernetes/navigation/matrix';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { podDashboard } from 'in-kubernetes/navigation/paths';
import tabs from 'in-kubernetes/Dashboards/Pod/tabs/index';
import { PodBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import { podTabChange } from 'in-kubernetes/tracker';

export default function PodDashboard({ location }) {
  const props = {
    podId: getMatrixParameter(location, podDashboard, matrixPodId),
    viewPath: podDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        podId={props.podId}
        renderBreadcrumbs={(clusterId, namespaceId, deploymentId) => (
          <Breadcrumbs
            items={PodBreadcrumbs({
              ...props,
              clusterId,
              namespaceId,
              deploymentId
            })}
          />
        )}
      />

      <TabView
        result$={getKubernetesPod({
          id: props.podId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={podTabChange}
        props={props}
        renderErrors={errors => (
          <ErroneousEntityVersionList snapshotId={props.podId} timeConfig={props.timeConfig} errors={errors} />
        )}
      />
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Pod"
      icon="lib_kubernetes_pod"
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}

function Actions({ podId, timeConfig, result }) {
  return (
    <Fragment>
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'clusterId'])}
        namespaceName={get(result, ['data', 'namespace'])}
        podName={get(result, ['data', 'label'])}
        timeConfig={timeConfig}
      />
      <EntityHealthIndicator
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        timeConfig={timeConfig}
        snapshotId={podId}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Pod" />
      <KubernetesIndicator result={result} />
    </Fragment>
  );
}
