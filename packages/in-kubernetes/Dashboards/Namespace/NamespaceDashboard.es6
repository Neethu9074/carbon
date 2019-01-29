import React, { Fragment } from 'react';
import { get } from 'lodash';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import { namespaceId as matrixNamespaceId, clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { namespaceDashboard } from 'in-kubernetes/navigation/paths';
import { NamespaceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Namespace/tabs/index';
import BetaMarker from 'in-new-components/BetaMarker';
import { getTimeConfig } from 'in-stores/time/config';
import Button from 'in-new-components/Button';

export default function NamespaceDashboard({ location }) {
  const props = {
    namespaceId: getMatrixParameter(location, namespaceDashboard, matrixNamespaceId),
    clusterId: getMatrixParameter(location, namespaceDashboard, matrixClusterId),
    viewPath: namespaceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs
        items={NamespaceBreadcrumbs({
          ...props
        })}
      />
      <TabView
        result$={getKubernetesNamespace({
          id: props.namespaceId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
      <BetaMarker title="Tech Preview">
        <p>
          You are looking at the new Kubernetes support from Instana, which is currently in a Tech Preview. Please get
          in touch with us for any questions and feedback
        </p>
        <Button kind="primaryv2" href="mailto:matthias.luebken@instana.com?subject=Feedback on Kubernetes support">
          Provide Feedback
        </Button>
      </BetaMarker>
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Namespace"
      icon="lib_kubernetes_namespace"
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}

function Actions({ namespaceId, timeConfig }) {
  return (
    <Fragment>
      <KubernetesEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        namespaceId={namespaceId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes() {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Namespace" />
      <KubernetesIndicator />
    </Fragment>
  );
}
