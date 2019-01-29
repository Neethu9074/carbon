import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  clusterId as matrixClusterId,
  namespaceId as matrixNamespaceId,
  podId as matrixPodId,
  deploymentId as matrixDeploymentId
} from 'in-kubernetes/navigation/matrix';
import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import BetaMarker from 'in-new-components/BetaMarker';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { podDashboard } from 'in-kubernetes/navigation/paths';
import tabs from 'in-kubernetes/Dashboards/Pod/tabs/index';
import { PodBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';

export default function PodDashboard({ location }) {
  const props = {
    podId: getMatrixParameter(location, podDashboard, matrixPodId),

    viewPath: podDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs
        items={PodBreadcrumbs({
          ...props,
          clusterId: getMatrixParameter(location, podDashboard, matrixClusterId),
          namespaceId: getMatrixParameter(location, podDashboard, matrixNamespaceId),
          deploymentId: getMatrixParameter(location, podDashboard, matrixDeploymentId)
        })}
      />
      <TabView
        result$={getKubernetesPod({
          id: props.podId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
      <BetaMarker title="Beta Feature">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa quod voluptates tempora nostrum illum possimus
          autem repellendus error impedit rem! Saepe, eius animi! Corporis eligendi at porro inventore ipsum totam.
        </p>
      </BetaMarker>
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

function Actions({ podId, timeConfig }) {
  return (
    <Fragment>
      <KubernetesEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        podId={podId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes() {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Pod" />
      <KubernetesIndicator />
    </Fragment>
  );
}
